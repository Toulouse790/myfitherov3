
// === Envoi vers proxy local ===
export async function sendToN8nWebhook(data: any): Promise<boolean> {
  try {
    const res = await fetch("/api/send-to-n8n", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Erreur lors de l'envoi au webhook n8n:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur proxy vers n8n :", error);
    return false;
  }
}

// Fonction utilitaire pour calculer l'âge
export function calculateAge(birthdate: string): number {
  if (!birthdate) return 0;
  
  const birthdateDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthdateDate.getFullYear();
  const monthDiff = today.getMonth() - birthdateDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdateDate.getDate())) {
    age--;
  }
  
  return age;
}
