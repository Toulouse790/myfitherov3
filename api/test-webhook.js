
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { webhookUrl, ...testData } = req.body;

  if (!webhookUrl) {
    return res.status(400).json({ 
      success: false, 
      message: "URL de webhook manquante"
    });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "no-cors",
      body: JSON.stringify({
        ...testData,
        test: true,
        timestamp: new Date().toISOString(),
        triggered_from: req.headers.origin || 'api',
      })
    });

    // Avec mode "no-cors", on ne peut pas vraiment savoir si la requête a réussi
    // On retourne donc une réponse "optimiste"
    return res.status(200).json({ 
      success: true,
      message: "Requête envoyée au webhook"
    });
  } catch (error) {
    console.error("Erreur lors du test du webhook:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur lors du test du webhook", 
      error: error.message 
    });
  }
}
