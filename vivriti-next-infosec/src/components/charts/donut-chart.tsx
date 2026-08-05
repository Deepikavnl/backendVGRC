import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Datum { name: string; value: number; color: string; }
export function DonutChart({ data, centerLabel, centerValue }: { data: Datum[]; centerLabel?: string; centerValue?: string | number }) {
  return (
    <div className="relative h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={2} strokeWidth={0}>
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(214 25% 89%)", fontSize: 12 }} />
          <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      {centerValue !== undefined && (
        <div className="pointer-events-none absolute inset-0 -mt-6 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">{centerValue}</span>
          {centerLabel && <span className="text-xs text-muted-foreground">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}
