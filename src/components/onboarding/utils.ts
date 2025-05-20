

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
    console.log("Envoi de données au webhook n8n...");
    console.log("Données envoyées:", JSON.stringify(data, null, 2));
    
    const response = await fetch("https://n8n.srv825462.hstgr.cloud/webhook/d84d0c09-59b4-4706-9746-0a4a83ad2609", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "no-cors", // Ajout du mode no-cors pour contourner les restrictions CORS
      body: JSON.stringify(data)
    });

    // Comme nous utilisons no-cors, nous ne recevrons pas de réponse analysable
    // Donc nous supposons que la demande a été envoyée avec succès
    console.log("Requête envoyée à n8n en mode no-cors");
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi vers le webhook n8n :", error);
    return false;
  }
}

