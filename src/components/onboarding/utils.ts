// src/components/onboarding/utils.ts

// Fonction utilitaire pour concaténer proprement les classes Tailwind (optionnel)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fonction utilitaire pour calculer l’âge à partir de la date de naissance
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
    const response = await fetch("https://n8n.srv825462.hstgr.cloud/webhook/production/formulaire-onboarding", {
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
