// === Envoi vers proxy local ===
export async function sendToN8nWebhook(data: any): Promise<boolean> {
  try {
    const res = await fetch("/api/send-to-n8n", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return res.ok;
  } catch (error) {
    console.error("Erreur proxy vers n8n :", error);
    return false;
  }
}
