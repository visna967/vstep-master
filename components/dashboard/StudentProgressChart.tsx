'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const mockData = [
  { day: 'Mon', xp: 120 },
  { day: 'Tue', xp: 180 },
  { day: 'Wed', xp: 90 },
  { day: 'Thu', xp: 220 },
  { day: 'Fri', xp: 300 },
  { day: 'Sat', xp: 400 },
  { day: 'Sun', xp: 150 },
];

export function StudentProgressChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff' }}
          itemStyle={{ color: '#60a5fa' }}
        />
        <Area type="monotone" dataKey="xp" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}