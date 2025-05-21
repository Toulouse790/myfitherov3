
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // In a real implementation, this would fetch from a database
    return res.status(200).json({ 
      success: true, 
      data: {
        url: 'https://n8n.example.com/webhook/myfit-prod-123456',
        status: 'connected'
      }
    });
  } else if (req.method === 'POST') {
    // In a real implementation, this would update the config in a database
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({
          success: false,
          error: "URL is required"
        });
      }
      
      // Mock successful update
      return res.status(200).json({
        success: true,
        message: "n8n configuration updated successfully"
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to update n8n configuration"
      });
    }
  } else {
    return res.status(405).json({ 
      success: false, 
      error: "Method not allowed" 
    });
  }
}
