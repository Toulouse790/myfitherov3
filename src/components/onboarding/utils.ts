
/**
 * Sends the user data to the n8n webhook
 * @param data User data to send
 * @returns Promise resolving to boolean indicating success
 */
export const sendToN8nWebhook = async (data: any): Promise<boolean> => {
  const webhookUrl = "https://n8n.srv825462.hstgr.cloud/webhook/formulaire-onboarding";
  
  try {
    await fetch(webhookUrl, {
      method: "POST",
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
    
    console.log("Data successfully sent to n8n webhook");
    return true;
  } catch (error) {
    console.error("Error sending data to n8n webhook:", error);
    return false;
  }
};

/**
 * Calculates age from birthdate
 * @param birthdate Date of birth string in YYYY-MM-DD format
 * @returns Age as a string or empty string if invalid
 */
export const calculateAge = (birthdate: string): string => {
  if (!birthdate) return "";
  
  const birthDate = new Date(birthdate);
  const today = new Date();
  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    calculatedAge--;
  }
  
  return calculatedAge.toString();
};
