
export const sendToN8nWebhook = async (data: any): Promise<boolean> => {
  const webhookUrl = "https://n8n.srv825462.hstgr.cloud/webhook/formulaire-onboarding";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST", // ← bien POST, pas GET
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

    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

    console.log("✅ Données envoyées avec succès à n8n");
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi au webhook :", error);
    return false;
  }
};

export const calculateAge = (birthdate: string): number => {
  if (!birthdate) return 0;
  
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};
