
import React from 'react';
import AdminSystemLogs from '@/components/admin/AdminSystemLogs';
import { LogEntry } from '@/services/admin';

interface AdminLogsTabProps {
  initialLogs: LogEntry[];
}

const AdminLogsTab: React.FC<AdminLogsTabProps> = ({ initialLogs }) => {
  return (
    <div className="space-y-4">
      <AdminSystemLogs initialLogs={initialLogs} />
    </div>
  );
};

export default AdminLogsTab;
