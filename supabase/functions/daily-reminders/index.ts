
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Récupérer tous les utilisateurs actifs
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('user_id, email, first_name')
      .not('email', 'is', null);

    if (error) {
      throw error;
    }

    const results = [];

    for (const user of users || []) {
      try {
        // Vérifier s'il y a eu une activité récente (dernières 24h)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const { data: recentActivity } = await supabase
          .from('daily_tracking')
          .select('id')
          .eq('user_id', user.user_id)
          .gte('date', yesterday.toISOString().split('T')[0])
          .limit(1);

        // Si pas d'activité récente, envoyer un rappel
        if (!recentActivity || recentActivity.length === 0) {
          const notificationResponse = await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({
              to: user.email,
              subject: 'MyFitHero - Ton entraînement t\'attend ! 💪',
              template: 'reminder',
              data: {
                firstName: user.first_name,
                workoutName: 'Entraînement du jour',
                duration: 30,
                workoutUrl: `${Deno.env.get('SITE_URL') || 'https://app.myfithero.com'}/workout`
              }
            })
          });

          const notificationResult = await notificationResponse.json();
          results.push({
            userId: user.user_id,
            email: user.email,
            status: notificationResult.success ? 'sent' : 'failed',
            error: notificationResult.error || null
          });

          // Logger l'activité
          await supabase.from('ai_training_data').insert({
            user_id: user.user_id,
            action_type: 'daily_reminder_sent',
            context: {
              email_sent: notificationResult.success,
              reminder_type: 'workout',
              timestamp: new Date().toISOString()
            }
          });
        } else {
          results.push({
            userId: user.user_id,
            email: user.email,
            status: 'skipped',
            reason: 'recent_activity'
          });
        }
      } catch (userError) {
        console.error(`Erreur pour l'utilisateur ${user.user_id}:`, userError);
        results.push({
          userId: user.user_id,
          email: user.email,
          status: 'error',
          error: userError.message
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed: results.length,
      results: results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Erreur dans daily-reminders:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
