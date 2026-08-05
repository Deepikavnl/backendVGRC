import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Datum { name: string; value: number; color?: string; }
export function SimpleBarChart({ data, color = "#1f47d8" }: { data: Datum[]; color?: string }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(214 25% 89%)" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip cursor={{ fill: "hsl(214 32% 95% / 0.5)" }} contentStyle={{ borderRadius: 8, border: "1px solid hsl(214 25% 89%)", fontSize: 12 }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={44}>
            {data.map((d, i) => <Cell key={i} fill={d.color ?? color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
