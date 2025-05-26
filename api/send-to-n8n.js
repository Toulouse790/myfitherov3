
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    // Utiliser l'URL du webhook depuis les variables d'environnement Vite
    const webhookUrl = process.env.VITE_N8N_WEBHOOK_URL;
    
    if (!webhookUrl) {
      return res.status(500).json({ success: false, message: "Configuration de webhook manquante" });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const text = await response.text();
      return res.status(response.status).json({ 
        success: false, 
        message: "Erreur côté n8n", 
        status: response.status,
        response: text 
      });
    }
  } catch (error) {
    console.error("Erreur du proxy:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur du proxy", 
      error: error.message 
    });
  }
}
