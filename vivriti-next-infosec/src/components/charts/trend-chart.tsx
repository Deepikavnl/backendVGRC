import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Datum { month: string; compliance: number; assessments: number; }
export function TrendChart({ data }: { data: Datum[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f47d8" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#1f47d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(214 25% 89%)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }} tickLine={false} axisLine={false} />
          <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(214 25% 89%)", fontSize: 12 }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="compliance" name="Compliance %" stroke="#1f47d8" strokeWidth={2.5} fill="url(#cGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
