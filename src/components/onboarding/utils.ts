
export function calculateAge(birthdate: string): number {
  const today = new Date();
  const birthdateObj = new Date(birthdate);
  let age = today.getFullYear() - birthdateObj.getFullYear();
  const monthDifference = today.getMonth() - birthdateObj.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdateObj.getDate())) {
    age--;
  }
  
  return age;
}

export async function sendToSupabase(data: any): Promise<boolean> {
  const SUPABASE_URL = "https://otpimqedxtwpuvbvdxhz.supabase.co";
  const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cGltcWVkeHR3cHV2YnZkeGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNzk2NzEsImV4cCI6MjA2Mjk1NTY3MX0.mJ-rhSsKJc9ySQnqFq12v4A_Mc05ktdoBWyvGqtifxQ";

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/utilisateurs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_API_KEY,
        "Authorization": `Bearer ${SUPABASE_API_KEY}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Erreur Supabase:", await response.text());
      return false;
    }

    console.log("Données enregistrées avec succès !");
    return true;
  } catch (error) {
    console.error("Erreur d'envoi Supabase:", error);
    return false;
  }
}

// Function to send data to the new n8n webhook URL
export async function sendToN8nWebhook(data: any): Promise<boolean> {
  const N8N_WEBHOOK_URL = "https://n8n.srv825462.hstgr.cloud/webhook/formulaire-onboarding";
  
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      console.error("Échec envoi webhook :", await response.text());
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Échec envoi webhook :", error);
    return false;
  }
}
