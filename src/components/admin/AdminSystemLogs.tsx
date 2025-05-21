
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Activity } from 'lucide-react';
import { LogEntry, LogFilterOptions } from '@/services/admin';

interface AdminSystemLogsProps {
  initialLogs?: LogEntry[];
}

const AdminSystemLogs: React.FC<AdminSystemLogsProps> = ({ initialLogs = [] }) => {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [filters, setFilters] = useState<LogFilterOptions>({});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-red-500" />
          Journaux système
        </CardTitle>
        <CardDescription>Erreurs et événements système récents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between mb-4">
            <div className="flex gap-2">
              <select 
                className="p-2 text-sm border rounded-md dark:bg-gray-800"
                onChange={(e) => setFilters({...filters, type: e.target.value as any})}
              >
                <option value="">Tous les types</option>
                <option value="error">Erreur</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
              <Input 
                type="date" 
                className="text-sm" 
                onChange={(e) => setFilters({...filters, date: e.target.value})}
              />
            </div>
            <Button variant="outline" size="sm">
              Exporter
            </Button>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Horodatage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Message</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {logs.length > 0 ? logs.map((log, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        log.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        log.type === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {log.type === 'error' ? 'Erreur' : 
                         log.type === 'warning' ? 'Warning' : 'Info'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{log.source}</td>
                    <td className="px-6 py-4 text-sm">{log.message}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      Aucun journal à afficher
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSystemLogs;
