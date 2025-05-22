
import React from 'react';
import { Users, Brain, Clock, CheckCircle2 } from 'lucide-react';
import { AdminStats } from '@/services/admin';
import AdminStatCard from '@/components/admin/AdminStatCard';

interface AdminDashboardStatsProps {
  stats: AdminStats;
  isLoading: boolean;
}

const AdminDashboardStats = ({ stats, isLoading }: AdminDashboardStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <AdminStatCard 
        title="Utilisateurs"
        value={stats.users}
        icon={<Users className="text-blue-500" />}
        trend={12.5}
        description="Total des comptes"
        className={isLoading ? "animate-pulse" : ""}
      />
      <AdminStatCard 
        title="Conversations"
        value={stats.conversations}
        icon={<Brain className="text-purple-500" />}
        trend={8.3}
        description="Interactions IA"
        className={isLoading ? "animate-pulse" : ""}
      />
      <AdminStatCard 
        title="Taux de réussite"
        value={`${stats.successRate}%`}
        icon={<CheckCircle2 className="text-green-500" />}
        trend={-1.2}
        description="Réponses valides"
        className={isLoading ? "animate-pulse" : ""}
      />
      <AdminStatCard 
        title="Temps de réponse"
        value={`${stats.responseTime}s`}
        icon={<Clock className="text-orange-500" />}
        trend={-5.7}
        trendDirection="down"
        description="Moyenne"
        className={isLoading ? "animate-pulse" : ""}
      />
    </div>
  );
};

export default AdminDashboardStats;
