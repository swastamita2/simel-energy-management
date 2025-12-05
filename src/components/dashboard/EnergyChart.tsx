import { Card } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface EnergyChartProps {
  title: string;
  data: Array<{
    time: string;
    consumption: number;
    efficiency?: number;
  }>;
  type?: "line" | "area";
}

export const EnergyChart = ({ title, data, type = "area" }: EnergyChartProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">{title}</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === "area" ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="consumption"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#colorConsumption)"
                name="Consumption (kW)"
              />
              {data[0]?.efficiency !== undefined && (
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  fill="url(#colorEfficiency)"
                  name="Efficiency (%)"
                />
              )}
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="consumption"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Consumption (kW)"
              />
              {data[0]?.efficiency !== undefined && (
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  name="Efficiency (%)"
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
