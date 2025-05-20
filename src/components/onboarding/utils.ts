
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
    // Ajout de logs pour le débogage
    console.log("Envoi de données au webhook n8n...");
    console.log("Données envoyées:", JSON.stringify(data, null, 2));
    
    const response = await fetch("https://n8n.srv825462.hstgr.cloud/webhook/d84d0c09-59b4-4706-9746-0a4a83ad2609", {
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