export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const n8nWebhookURL = 'https://n8n.srv825462.hstgr.cloud/webhook/d84d0c09-59b4-4706-9746-0a4a83ad2609';

    const response = await fetch(n8nWebhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    return res.status(response.status).json({ message: 'Requête transmise à n8n' });
  } catch (error) {
    console.error('Erreur dans le proxy :', error);
    return res.status(500).json({ error: 'Erreur lors de l’envoi vers n8n' });
  }
}

    return res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
