import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export default function StatsCard({ title, value, icon: Icon, color = 'primary' }) {
  const colorStyles = {
    primary: { color: 'var(--primary)' },
    accent: { color: 'var(--accent)' },
    green: { color: '#22c55e' },
    red: { color: '#ef4444' }
  };

  return (
    <Card style={{ border: '1px solid var(--border)' }}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <div style={colorStyles[color]}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--text-light)' }}>{title}</p>
            <p className="text-xl font-semibold" style={{ color: 'var(--text)' }}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
