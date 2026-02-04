import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const reasons = [
  { value: 'cash_payment', label: 'Cash Payment' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'private_event', label: 'Private Event' },
  { value: 'other', label: 'Other' }
];

export default function ReservedDateForm({ 
  open, 
  onClose, 
  onSave, 
  providers,
  existingDate = null 
}) {
  const [loading, setLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    service_provider_id: existingDate?.service_provider_id || '',
    date: existingDate?.date ? new Date(existingDate.date) : null,
    reason: existingDate?.reason || '',
    notes: existingDate?.notes || '',
    client_name: existingDate?.client_name || '',
    amount_paid: existingDate?.amount_paid || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedProvider = providers.find(p => p.id === formData.service_provider_id);
    
    await onSave({
      ...formData,
      provider_slug: selectedProvider?.slug || '',
      date: format(formData.date, 'yyyy-MM-dd'),
      amount_paid: formData.amount_paid ? parseFloat(formData.amount_paid) : null
    });

    setLoading(false);
    onClose();
  };

  const showPaymentFields = formData.reason === 'cash_payment' || formData.reason === 'subscription';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingDate ? 'Edit Reserved Date' : 'Add Reserved Date'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Provider *</Label>
            <Select
              value={formData.service_provider_id}
              onValueChange={(value) => setFormData({...formData, service_provider_id: value})}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map(provider => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !formData.date && "text-slate-400"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => {
                    setFormData({...formData, date});
                    setCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Reason *</Label>
            <Select
              value={formData.reason}
              onValueChange={(value) => setFormData({...formData, reason: value})}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {reasons.map(r => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showPaymentFields && (
            <>
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input
                  value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                  placeholder="Client name"
                />
              </div>
              <div className="space-y-2">
                <Label>Amount Paid</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount_paid}
                  onChange={(e) => setFormData({...formData, amount_paid: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.service_provider_id || !formData.date || !formData.reason}
              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
