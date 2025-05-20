export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const n8nWebhookURL = 'https://n8n.srv825462.hstgr.cloud/webhook/formulaire-onboarding';

    const response = await fetch(n8nWebhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur n8n :", errorText);
      return res.status(500).json({ error: 'n8n webhook error', details: errorText });
    }

    const result = await response.json();
    return res.status(200).json({ success: true, result });

  } catch (error) {
    console.error("Erreur proxy :", error);
    return res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
