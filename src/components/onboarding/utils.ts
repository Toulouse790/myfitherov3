export async function sendToN8nWebhook(data: any): Promise<boolean> {
  try {
    const response = await fetch("/api/send-to-n8n", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return response.ok;
  } catch (error) {
    console.error("Erreur proxy → n8n :", error);
    return false;
  }
}
