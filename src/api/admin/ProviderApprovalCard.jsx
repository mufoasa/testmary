import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Phone, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Power
} from 'lucide-react';
import { format } from 'date-fns';

const categoryLabels = {
  wedding_hall: 'Wedding Hall',
  service: 'Service'
};

const statusColors = {
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700'
};

export default function ProviderApprovalCard({ 
  provider, 
  onApprove, 
  onReject, 
  onToggleActive,
  onView
}) {
  const displayType = provider.category === 'wedding_hall' 
    ? categoryLabels.wedding_hall 
    : (provider.service_type || categoryLabels.service);

  return (
    <Card style={{ border: '1px solid var(--border)' }}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium truncate" style={{ color: 'var(--text)' }}>{provider.name_en}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className={`text-xs ${statusColors[provider.approval_status]}`}>
                  {provider.approval_status}
                </Badge>
                <span className="text-xs" style={{ color: 'var(--text-light)' }}>{displayType}</span>
                {provider.is_active && (
                  <span className="text-xs text-green-600">Active</span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(provider)}
              className="h-8 px-2 flex-shrink-0"
              style={{ color: 'var(--text-light)' }}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm" style={{ color: 'var(--text-light)' }}>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{provider.city || '-'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              <span>{provider.phone || '-'}</span>
            </div>
            <span className="text-xs">
              {format(new Date(provider.created_date), 'MMM d, yyyy')}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {provider.approval_status === 'pending' && (
              <>
                <Button
                  onClick={() => onApprove(provider)}
                  className="flex-1 h-9 bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  onClick={() => onReject(provider)}
                  variant="outline"
                  className="flex-1 h-9 text-sm"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            )}

            {provider.approval_status === 'approved' && (
              <Button
                onClick={() => onToggleActive(provider)}
                variant="outline"
                size="sm"
                className="h-9 text-sm"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <Power className="h-4 w-4 mr-1" />
                {provider.is_active ? 'Deactivate' : 'Activate'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
