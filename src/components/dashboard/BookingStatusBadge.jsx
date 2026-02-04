import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, Ban } from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    style: { backgroundColor: 'var(--secondary)', color: 'var(--primary-dark)', borderColor: 'var(--accent)' }
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle2,
    style: { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' }
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    style: { backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }
  },
  cancelled: {
    label: 'Cancelled',
    icon: Ban,
    style: { backgroundColor: 'var(--bg-light)', color: 'var(--text-light)', borderColor: 'var(--border)' }
  }
};

export default function BookingStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className="border gap-1.5" style={config.style}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}
