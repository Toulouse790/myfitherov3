
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/sonner';
import { 
  AdminService, 
  AdminStats, 
  AgentStats, 
  LogEntry 
} from '@/services/admin';
import { retryOperation } from '@/utils/retryOperation';

export const useAdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    users: 0,
    conversations: 0,
    successRate: 0,
    responseTime: 0,
    activeSessions: 0
  });
  const [agents, setAgents] = useState<AgentStats[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  
  const checkAuthentication = useCallback(() => {
    const isAuth = AdminService.isAuthenticated();
    setIsAuthenticated(isAuth);
    return isAuth;
  }, []);
  
  const fetchDashboardData = useCallback(async () => {
    setDashboardLoading(true);
    
    try {
      // Use retry operation for better resilience
      const [systemStats, agentStats, systemLogs] = await Promise.all([
        retryOperation(() => AdminService.getSystemStats(), 2),
        retryOperation(() => AdminService.getAgents(), 2),
        retryOperation(() => AdminService.getSystemLogs(), 2)
      ]);
      
      setStats(systemStats);
      setAgents(agentStats);
      setLogs(systemLogs);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Erreur', { 
        description: 'Impossible de charger les données du dashboard' 
      });
    } finally {
      setDashboardLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const isAuth = checkAuthentication();
    if (isAuth) {
      fetchDashboardData();
    }
  }, [checkAuthentication, fetchDashboardData]);

  return {
    isAuthenticated,
    setIsAuthenticated,
    stats,
    agents,
    logs,
    dashboardLoading,
    fetchDashboardData,
    checkAuthentication
  };
};
