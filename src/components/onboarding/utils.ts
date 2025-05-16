// Fonction utilitaire pour envoyer les données vers Supabase
export async function sendToSupabase(userData: any): Promise<boolean> {
  const SUPABASE_URL = "https://otpimqedxtwpuvbvdxhz.supabase.co";
  const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cGltcWVkeHR3cHV2YnZkeGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNzk2NzEsImV4cCI6MjA2Mjk1NTY3MX0.mJ-rhSsKJc9ySQnqFq12v4A_Mc05ktdoBWyvGqtifxQ";

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/utilisateurs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify(userData),
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
