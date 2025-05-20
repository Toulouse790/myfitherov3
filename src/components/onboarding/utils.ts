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

// === FONCTION : envoi vers le proxy sécurisé (Vercel) ===
export async function sendToN8nWebhook(data: any): Promise<boolean> {
  try {
    alert("✅ Fonction appelée !");
    
    const response = await fetch("/api/send-to-n8n", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (response.ok || response.status === 204) {
      alert("📬 Données envoyées avec succès !");
      return true;
    } else {
      alert("❌ Échec de l'envoi : " + response.status);
      return false;
    }
  } catch (error) {
    alert("🚨 Erreur réseau : " + error);
    return false;
  }
}
