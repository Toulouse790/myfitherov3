
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  BarChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { LineChart as LineChartIcon, BarChart3 } from 'lucide-react';

// Sample data for the charts
const activityData = [
  { name: 'Lundi', conversations: 65, requests: 78 },
  { name: 'Mardi', conversations: 59, requests: 65 },
  { name: 'Mercredi', conversations: 80, requests: 91 },
  { name: 'Jeudi', conversations: 81, requests: 90 },
  { name: 'Vendredi', conversations: 56, requests: 85 },
  { name: 'Samedi', conversations: 55, requests: 53 },
  { name: 'Dimanche', conversations: 40, requests: 42 },
];

const agentDistribution = [
  { name: 'Nutrition', value: 35 },
  { name: 'Sommeil', value: 25 },
  { name: 'Musculation', value: 30 },
  { name: 'Hydratation', value: 10 },
];

const AdminActivityCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5 text-blue-500" />
            Activité utilisateurs
          </CardTitle>
          <CardDescription>Conversations et requêtes sur 7 jours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activityData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="conversations" stroke="#8884d8" />
                <Line type="monotone" dataKey="requests" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Distribution des requêtes
          </CardTitle>
          <CardDescription>Par type d'agent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={agentDistribution}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminActivityCharts;
