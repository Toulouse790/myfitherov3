
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, userId, agentType = 'fitness' } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Récupérer le contexte utilisateur
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Système de prompts spécialisés
    const systemPrompts = {
      fitness: `Vous êtes un coach sportif expert français spécialisé dans MyFitHero. 
      Utilisez les informations du profil utilisateur pour personnaliser vos conseils.
      Répondez toujours en français de manière encourageante et professionnelle.`,
      
      nutrition: `Vous êtes un nutritionniste expert français pour MyFitHero.
      Donnez des conseils nutritionnels personnalisés basés sur le profil utilisateur.
      Répondez en français avec des recommandations pratiques.`,
      
      wellness: `Vous êtes un expert en bien-être français pour MyFitHero.
      Aidez l'utilisateur avec des conseils sur le sommeil, la gestion du stress et l'équilibre de vie.
      Répondez en français avec empathie et professionnalisme.`
    };

    const systemPrompt = systemPrompts[agentType as keyof typeof systemPrompts] || systemPrompts.fitness;

    // Construire le contexte utilisateur
    let userContext = '';
    if (userProfile) {
      userContext = `Profil utilisateur: ${userProfile.first_name || 'Utilisateur'}, `;
      if (userProfile.age) userContext += `${userProfile.age} ans, `;
      if (userProfile.gender) userContext += `${userProfile.gender}, `;
      if (userProfile.height_cm && userProfile.weight_kg) {
        userContext += `${userProfile.height_cm}cm, ${userProfile.weight_kg}kg. `;
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `${systemPrompt}\n\n${userContext}` 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Sauvegarder la conversation
    await supabase.from('ai_conversations').insert({
      user_id: userId,
      agent_id: agentType,
      title: prompt.substring(0, 100),
      status: 'completed'
    });

    // Logger l'interaction
    await supabase.from('ai_training_data').insert({
      user_id: userId,
      action_type: 'ai_chat',
      model_name: `${agentType}_agent`,
      response_time_ms: Date.now(),
      context: {
        agent_type: agentType,
        prompt_length: prompt.length,
        response_length: aiResponse.length
      }
    });

    return new Response(JSON.stringify({ 
      response: aiResponse,
      agentType,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Une erreur est survenue'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
