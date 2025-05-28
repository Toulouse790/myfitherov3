
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, template, data } = await req.json();

    if (!to || !subject || !template) {
      throw new Error('Paramètres manquants: to, subject, template requis');
    }

    // Templates d'emails
    const emailTemplates = {
      welcome: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Bienvenue dans MyFitHero ! 🦸‍♂️</h1>
          <p>Salut ${data?.firstName || 'Champion'},</p>
          <p>Félicitations ! Ton voyage vers une meilleure version de toi-même commence maintenant.</p>
          <p>Avec MyFitHero, tu vas pouvoir :</p>
          <ul>
            <li>📊 Suivre tes progrès en temps réel</li>
            <li>🥗 Recevoir des conseils nutrition personnalisés</li>
            <li>💪 Accéder à des programmes d'entraînement adaptés</li>
            <li>🤖 Discuter avec ton coach IA personnel</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data?.dashboardUrl || '#'}" 
               style="background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
              Commencer maintenant
            </a>
          </div>
          <p>À bientôt,<br>L'équipe MyFitHero</p>
        </div>
      `,
      
      reminder: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">N'oublie pas ton entraînement ! 💪</h1>
          <p>Salut ${data?.firstName || 'Champion'},</p>
          <p>Ton programme t'attend ! Il est temps de faire bouger ton corps.</p>
          <p><strong>Programme du jour :</strong> ${data?.workoutName || 'Entraînement personnalisé'}</p>
          <p><strong>Durée estimée :</strong> ${data?.duration || '30'} minutes</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data?.workoutUrl || '#'}" 
               style="background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
              Commencer l'entraînement
            </a>
          </div>
          <p>Chaque pas compte vers ton objectif ! 🎯</p>
          <p>L'équipe MyFitHero</p>
        </div>
      `,
      
      achievement: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Félicitations ! Tu as débloqué un succès ! 🏆</h1>
          <p>Salut ${data?.firstName || 'Champion'},</p>
          <p>Bravo ! Tu viens de débloquer : <strong>${data?.achievementName || 'Nouveau succès'}</strong></p>
          <p style="font-style: italic;">"${data?.achievementDescription || 'Un pas de plus vers tes objectifs !'}"</p>
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <h2 style="color: #10b981; margin: 0;">🎉 ${data?.achievementName || 'Succès débloqué'} 🎉</h2>
            <p style="margin: 10px 0 0 0;">Points gagnés: ${data?.points || '50'} pts</p>
          </div>
          <p>Continue comme ça, tu es sur la bonne voie !</p>
          <p>L'équipe MyFitHero</p>
        </div>
      `
    };

    const htmlContent = emailTemplates[template as keyof typeof emailTemplates];
    
    if (!htmlContent) {
      throw new Error('Template non trouvé');
    }

    const emailResponse = await resend.emails.send({
      from: "MyFitHero <noreply@myfithero.app>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html: htmlContent,
    });

    console.log("Email envoyé avec succès:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Erreur envoi email:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
