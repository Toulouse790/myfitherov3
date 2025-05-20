export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const response = await fetch("https://n8n.srv825462.hstgr.cloud/webhook/d84d0c09-59b4-4706-9746-0a4a83ad2609", {
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
      return res.status(500).json({ success: false, message: "Erreur côté n8n", response: text });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Erreur du proxy", error: error.message });
  }
}
