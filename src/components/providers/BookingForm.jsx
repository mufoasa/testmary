import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';
import { useLanguage } from './LanguageContext';

export default function BookingForm({ provider }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bookedDates, setBookedDates] = useState([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    event_date: null,
    event_type: '',
    event_type_other: '',
    guests: '',
    special_requests: ''
  });

  useEffect(() => {
    loadBookedDates();
  }, [provider.id]);

  const loadBookedDates = async () => {
    const bookings = await base44.entities.Booking.filter({
      service_provider_id: provider.id,
    });
    
    const dates = bookings
      .filter(b => b.status === 'pending' || b.status === 'accepted')
      .map(b => new Date(b.event_date));
    
    setBookedDates(dates);
  };

  const isDateDisabled = (date) => {
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return true;
    
    return bookedDates.some(bookedDate => 
      format(bookedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const dateString = format(formData.event_date, 'yyyy-MM-dd');
    
    const existingBookings = await base44.entities.Booking.filter({
      service_provider_id: provider.id,
      event_date: dateString
    });
    
    const hasConflict = existingBookings.some(b => 
      b.status === 'pending' || b.status === 'accepted'
    );

    if (hasConflict) {
      setError(t('bookingError'));
      setLoading(false);
      return;
    }
    
    await base44.entities.Booking.create({
      service_provider_id: provider.id,
      provider_slug: provider.slug,
      provider_owner_email: provider.owner_email,
      client_name: formData.client_name,
      client_phone: formData.client_phone,
      client_email: formData.client_email || null,
      event_date: dateString,
      event_type: formData.event_type,
      event_type_other: formData.event_type === 'other' ? formData.event_type_other : null,
      guests: formData.guests ? parseInt(formData.guests) : null,
      special_requests: formData.special_requests || null,
      status: 'pending'
    });

    setSuccess(true);
    setFormData({
      client_name: '',
      client_phone: '',
      client_email: '',
      event_date: null,
      event_type: '',
      event_type_other: '',
      guests: '',
      special_requests: ''
    });
    loadBookedDates();
    setLoading(false);
  };

  const eventTypes = [
    { value: 'wedding', label: t('wedding') },
    { value: 'birthday', label: t('birthday') },
    { value: 'corporate', label: t('corporate') },
    { value: 'anniversary', label: t('anniversary') },
    { value: 'engagement', label: t('engagement') },
    { value: 'graduation', label: t('graduation') },
    { value: 'other', label: t('other') }
  ];

  return (
    <Card style={{ border: '1px solid var(--border)' }}>
      <CardHeader className="pb-4 px-4 sm:px-6">
        <CardTitle className="text-lg" style={{ color: 'var(--text)' }}>
          {t('bookingTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {success ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              {t('success')}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {t('bookingSuccess')}
            </p>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setSuccess(false)}
            >
              Book Again
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="client_name" className="text-sm">
                  {t('yourName')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="client_phone" className="text-sm">
                  {t('phoneNumber')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="client_phone"
                  type="tel"
                  value={formData.client_phone}
                  onChange={(e) => setFormData({...formData, client_phone: e.target.value})}
                  required
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="client_email" className="text-sm">
                {t('email')}
              </Label>
              <Input
                id="client_email"
                type="email"
                value={formData.client_email}
                onChange={(e) => setFormData({...formData, client_email: e.target.value})}
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">
                  {t('eventDate')} <span className="text-red-500">*</span>
                </Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full h-10 justify-start text-left font-normal ${
                        !formData.event_date && "text-slate-400"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.event_date ? (
                        format(formData.event_date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.event_date}
                      onSelect={(date) => {
                        setFormData({...formData, event_date: date});
                        setCalendarOpen(false);
                      }}
                      disabled={isDateDisabled}
                      initialFocus
                      fromDate={new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">
                  {t('eventType')} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.event_type}
                  onValueChange={(value) => setFormData({...formData, event_type: value})}
                  required
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.event_type === 'other' && (
              <div className="space-y-1.5">
                <Label htmlFor="event_type_other" className="text-sm">
                  Specify Event Type <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="event_type_other"
                  value={formData.event_type_other}
                  onChange={(e) => setFormData({...formData, event_type_other: e.target.value})}
                  required
                  className="h-10"
                />
              </div>
            )}

            {provider.capacity && (
              <div className="space-y-1.5">
                <Label htmlFor="guests" className="text-sm">
                  {t('numberOfGuests')}
                  <span className="text-slate-400 ml-1">(max: {provider.capacity})</span>
                </Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max={provider.capacity}
                  value={formData.guests}
                  onChange={(e) => setFormData({...formData, guests: e.target.value})}
                  className="h-10"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="special_requests" className="text-sm">
                {t('specialRequests')}
              </Label>
              <Textarea
                id="special_requests"
                value={formData.special_requests}
                onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                rows={3}
                className="resize-none"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11"
              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              disabled={loading || !formData.event_date || !formData.event_type}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                t('submitBooking')
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
