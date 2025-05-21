
export default async function handler(req, res) {
  // In a real implementation, this would fetch logs from a database or log service
  // For now, we're returning mock data
  
  // Parse query params
  const type = req.query?.type;
  const date = req.query?.date;
  const limit = parseInt(req.query?.limit) || 10;
  
  // Mock logs data
  const allLogs = [
    {
      timestamp: '2025-05-21T14:32:15Z',
      type: 'error',
      source: 'Agent Nutrition',
      message: 'Échec de connexion à l\'API OpenAI - Timeout après 30s'
    },
    {
      timestamp: '2025-05-21T14:28:10Z',
      type: 'warning',
      source: 'n8n Webhook',
      message: 'Réponse lente du service externe (5.2s)'
    },
    {
      timestamp: '2025-05-21T14:15:43Z',
      type: 'info',
      source: 'Système',
      message: 'Configuration mise à jour avec succès'
    },
    {
      timestamp: '2025-05-21T13:45:22Z',
      type: 'info',
      source: 'Agent Sommeil',
      message: 'Nouvelle version du modèle déployée'
    },
    {
      timestamp: '2025-05-21T12:33:18Z',
      type: 'warning',
      source: 'Base de données',
      message: 'Connexion instable - Retry automatique'
    }
  ];
  
  // Filter logs if type is provided
  let filteredLogs = allLogs;
  if (type) {
    filteredLogs = filteredLogs.filter(log => log.type === type);
  }
  
  // Filter by date if provided
  if (date) {
    const filterDate = new Date(date);
    filteredLogs = filteredLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === filterDate.toDateString();
    });
  }
  
  // Apply limit
  filteredLogs = filteredLogs.slice(0, limit);
  
  return res.status(200).json({ 
    success: true, 
    data: filteredLogs
  });
}
