import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { 
  CalendarDays, 
  User, 
  Phone, 
  Mail, 
  Users, 
  CheckCircle,
  XCircle
} from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';

const eventTypeLabels = {
  wedding: 'Wedding',
  birthday: 'Birthday',
  corporate: 'Corporate',
  anniversary: 'Anniversary',
  engagement: 'Engagement',
  graduation: 'Graduation',
  other: 'Other'
};

export default function BookingCard({ 
  booking, 
  onAccept, 
  onReject, 
  showProviderName = false,
  providerName = ''
}) {
  const canModify = booking.status === 'pending';

  return (
    <Card style={{ border: '1px solid var(--border)' }}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <BookingStatusBadge status={booking.status} />
              <span className="text-xs" style={{ color: 'var(--text-light)' }}>
                {format(new Date(booking.created_date), 'MMM d, yyyy')}
              </span>
            </div>
            {showProviderName && providerName && (
              <span className="text-sm" style={{ color: 'var(--text-light)' }}>{providerName}</span>
            )}
          </div>

          {/* Event Date */}
          <div className="flex items-center gap-2 text-base font-medium" style={{ color: 'var(--text)' }}>
            <CalendarDays className="h-4 w-4" style={{ color: 'var(--primary)' }} />
            {format(new Date(booking.event_date), 'EEE, MMM d, yyyy')}
            <span className="text-sm font-normal" style={{ color: 'var(--text-light)' }}>
              · {eventTypeLabels[booking.event_type] || booking.event_type}
            </span>
          </div>

          {/* Client Details */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm" style={{ color: 'var(--text-light)' }}>
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>{booking.client_name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              <a href={`tel:${booking.client_phone}`} style={{ color: 'var(--text-light)' }} className="hover:underline">
                {booking.client_phone}
              </a>
            </div>
            {booking.client_email && (
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                <a href={`mailto:${booking.client_email}`} className="truncate max-w-[180px] hover:underline" style={{ color: 'var(--text-light)' }}>
                  {booking.client_email}
                </a>
              </div>
            )}
            {booking.guests && (
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span>{booking.guests} guests</span>
              </div>
            )}
          </div>

          {booking.special_requests && (
            <div className="p-3 rounded text-sm" style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-light)' }}>
              {booking.special_requests}
            </div>
          )}

          {/* Actions */}
          {canModify && (
            <div className="flex gap-2 pt-1">
              <Button
                onClick={() => onAccept(booking)}
                className="flex-1 h-9 bg-green-600 hover:bg-green-700 text-white text-sm"
              >
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Accept
              </Button>
              <Button
                onClick={() => onReject(booking)}
                variant="outline"
                className="flex-1 h-9 text-sm"
                style={{ borderColor: 'var(--border)', color: 'var(--text-light)' }}
              >
                <XCircle className="h-4 w-4 mr-1.5" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
