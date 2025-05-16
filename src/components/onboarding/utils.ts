
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

// === FONCTION : envoi vers n8n ===
export async function sendToN8nWebhook(data: any): Promise<boolean> {
  try {
    const response = await fetch("https://n8n.srv825462.hstgr.cloud/webhook/formulaire-onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      console.log("Données envoyées à n8n avec succès !");
      return true;
    } else {
      console.error("Échec de l'envoi à n8n :", await response.text());
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi vers le webhook n8n :", error);
    return false;
  }
}

// === FONCTION : envoi vers Supabase ===
export async function sendToSupabase(userData: any): Promise<boolean> {
  const SUPABASE_URL = "https://otpimqedxtwpuvbvdxhz.supabase.co";
  const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cGltcWVkeHR3cHV2YnZkeGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNzk2NzEsImV4cCI6MjA2Mjk1NTY3MX0.mJ-rhSsKJc9ySQnqFq12v4A_Mc05ktdoBWyvGqtifxQ";

  try {
    // On supprime la propriété 'age' car la table n'a pas cette colonne
    const { age, ...dataWithoutAge } = userData;
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/utilisateurs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify(dataWithoutAge),
    });

    if (response.ok) {
      console.log("Données enregistrées avec succès !");
      return true;
    } else {
      console.error("Erreur d'envoi Supabase (réponse non OK) :", await response.text());
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi vers Supabase :", error);
    return false;
  }
}
