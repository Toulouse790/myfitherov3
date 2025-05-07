
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  name: string;
  [key: string]: string | number;
}

interface ProgressChartProps {
  title: string;
  data: DataPoint[];
  dataKeys: {
    key: string;
    color: string;
    name: string;
  }[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ title, data, dataKeys }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--muted-foreground)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--card-foreground)"
                }}
              />
              <Legend />
              {dataKeys.map((dataKey) => (
                <Line
                  key={dataKey.key}
                  type="monotone"
                  dataKey={dataKey.key}
                  name={dataKey.name}
                  stroke={dataKey.color}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
