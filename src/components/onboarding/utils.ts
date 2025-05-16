
// src/components/onboarding/utils.ts

// Fonction utilitaire pour concaténer proprement les classes Tailwind (optionnel)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fonction utilitaire pour calculer l'âge à partir de la date de naissance
export function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}

// Fonction utilitaire pour envoyer les données vers n8n
export async function sendToN8nWebhook(data: any): Promise<boolean> {
  try {
    const response = await fetch("https://n8n.srv825462.hstgr.cloud/webhook/formulaire-onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return response.ok;
  } catch (error) {
    console.error("Erreur lors de l'envoi vers le webhook n8n :", error);
    return false;
  }
}

// Fonction utilitaire pour envoyer les données vers Supabase
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
        "Prefer": "return=minimal"
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
