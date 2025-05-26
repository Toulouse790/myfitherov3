
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BaseDataPoint {
  name: string;
  [key: string]: string | number;
}

interface ProgressChartProps {
  title: string;
  data: BaseDataPoint[];
  dataKeys: {
    key: string;
    color: string;
    name: string;
  }[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ title, data, dataKeys }) => {
  // Afficher un message encourageant si aucune donnée
  if (!data || data.length === 0 || data.every(item => 
    dataKeys.every(key => (item[key.key] as number) === 0)
  )) {
    return (
      <Card className="w-full h-[220px]"> {/* Hauteur réduite */}
        <CardHeader className="pb-2 p-3"> {/* Padding réduit */}
          <CardTitle className="text-sm">{title}</CardTitle> {/* Titre plus petit */}
        </CardHeader>
        <CardContent className="p-3 pt-0"> {/* Padding réduit */}
          <div className="h-[160px] flex items-center justify-center"> {/* Hauteur réduite */}
            <div className="text-center">
              <p className="text-muted-foreground mb-1 text-sm"> {/* Texte plus petit */}
                📊 Vos données apparaîtront ici
              </p>
              <p className="text-xs text-muted-foreground">
                Commencez votre première séance pour voir vos progrès !
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[220px]"> {/* Hauteur réduite */}
      <CardHeader className="pb-2 p-3"> {/* Padding réduit */}
        <CardTitle className="text-sm">{title}</CardTitle> {/* Titre plus petit */}
      </CardHeader>
      <CardContent className="p-3 pt-0"> {/* Padding réduit */}
        <div className="h-[160px]"> {/* Hauteur réduite */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 15, left: 10, bottom: 5 }} // Marges réduites
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--muted-foreground)"
                fontSize={10} // Police plus petite
              />
              <YAxis 
                stroke="var(--muted-foreground)"
                fontSize={10} // Police plus petite
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--card-foreground)",
                  fontSize: "12px" // Tooltip plus petit
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} /> {/* Légende plus petite */}
              {dataKeys.map((dataKey) => (
                <Line
                  key={dataKey.key}
                  type="monotone"
                  dataKey={dataKey.key}
                  name={dataKey.name}
                  stroke={dataKey.color}
                  activeDot={{ r: 4 }} // Point plus petit
                  strokeWidth={1.5} // Ligne plus fine
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
