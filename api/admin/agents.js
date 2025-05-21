
export default async function handler(req, res) {
  // In a real implementation, this would connect to a database
  // For now, we're returning mock data
  
  const agents = [
    { 
      id: 'nutrition-agent', 
      name: 'Agent Nutrition', 
      type: 'nutrition',
      status: 'active', 
      responseTime: 1.2,
      successRate: 97.8,
      lastActive: new Date().toISOString(),
      model: 'gpt-4o'
    },
    { 
      id: 'sommeil-agent', 
      name: 'Agent Sommeil', 
      type: 'sommeil',
      status: 'active', 
      responseTime: 1.5,
      successRate: 95.2,
      lastActive: new Date().toISOString(),
      model: 'gpt-4o'
    },
    { 
      id: 'muscu-agent', 
      name: 'Agent Musculation', 
      type: 'muscu',
      status: 'active', 
      responseTime: 1.8,
      successRate: 96.5,
      lastActive: new Date().toISOString(),
      model: 'gpt-4o'
    },
    { 
      id: 'hydratation-agent', 
      name: 'Agent Hydratation', 
      type: 'hydratation',
      status: 'inactive', 
      responseTime: 1.4,
      successRate: 94.7,
      lastActive: new Date().toISOString(),
      model: 'gpt-4o-mini'
    },
    { 
      id: 'synthese-agent', 
      name: 'Agent Synthèse', 
      type: 'synthese',
      status: 'active', 
      responseTime: 2.5,
      successRate: 98.3,
      lastActive: new Date().toISOString(),
      model: 'gpt-4o'
    }
  ];

  if (req.method === 'GET') {
    return res.status(200).json({ 
      success: true, 
      data: agents
    });
  } else if (req.method === 'POST') {
    // Handle agent creation (not implemented in this mock)
    return res.status(200).json({ 
      success: true, 
      message: "Agent created successfully"
    });
  } else {
    return res.status(405).json({ 
      success: false, 
      error: "Method not allowed" 
    });
  }
}
