export async function sendToN8nWebhook(data: any): Promise<boolean> {
  const webhookUrl = "https://n8n.srv825462.hstgr.cloud/webhook/formulaire-onboarding";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        source: "MyFitHero Onboarding",
        action: "profile_created"
      }),
    });

    if (!response.ok) {
      console.error("Erreur lors de l’envoi à n8n :", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Échec envoi webhook :", error);
    return false;
  }
}

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
