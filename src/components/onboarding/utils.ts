// === FONCTION : calcul de l'âge ===
export function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// === FONCTION : envoi vers le proxy sécurisé (Vercel) ===
export async function sendToN8nWebhook(data: any): Promise<boolean> {
  try {
    const webhookProxyUrl = "https://myfitherov3.vercel.app/api/send-to-n8n";

    console.log("📤 Envoi de données au proxy Vercel...");
    console.log("🔎 Données envoyées :", JSON.stringify(data, null, 2));

    const response = await fetch(webhookProxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Échec d'envoi vers le proxy :", errorText);
      return false;
    }

    const result = await response.json();
    console.log("✅ Données transférées à n8n avec succès :", result);
    return true;

  } catch (error) {
    console.error("🚨 Erreur de communication avec le proxy Vercel :", error);
    return false;
  }
}
