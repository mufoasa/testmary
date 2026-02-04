import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building2, 
  CalendarDays, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import ProviderForm from '../components/dashboard/ProviderForm';
import BookingCard from '../components/dashboard/BookingCard';
import StatsCard from '../components/dashboard/StatsCard';

export default function ProviderDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [provider, setProvider] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingFilter, setBookingFilter] = useState('all');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authenticated = await base44.auth.isAuthenticated();
    if (!authenticated) {
      base44.auth.redirectToLogin(createPageUrl('ProviderDashboard'));
      return;
    }
    
    const userData = await base44.auth.me();
    setUser(userData);
    
    // Check if admin
    if (userData.role === 'admin') {
      window.location.href = createPageUrl('AdminDashboard');
      return;
    }
    
    await loadProviderData(userData.email);
    setLoading(false);
  };

  const loadProviderData = async (email) => {
    const providers = await base44.entities.ServiceProvider.filter({
      owner_email: email
    });
    
    if (providers.length > 0) {
      setProvider(providers[0]);
      
      const bookingsData = await base44.entities.Booking.filter({
        service_provider_id: providers[0].id
      }, '-created_date');
      setBookings(bookingsData);
    }
  };

  const handleSaveProvider = async (data) => {
    if (provider) {
      await base44.entities.ServiceProvider.update(provider.id, data);
      setProvider({ ...provider, ...data });
    }
  };

  const handleAcceptBooking = async (booking) => {
    await base44.entities.Booking.update(booking.id, { status: 'accepted' });
    setBookings(bookings.map(b => 
      b.id === booking.id ? { ...b, status: 'accepted' } : b
    ));
  };

  const handleRejectBooking = async (booking) => {
    await base44.entities.Booking.update(booking.id, { status: 'rejected' });
    setBookings(bookings.map(b => 
      b.id === booking.id ? { ...b, status: 'rejected' } : b
    ));
  };

  const filteredBookings = bookings.filter(b => 
    bookingFilter === 'all' || b.status === bookingFilter
  );

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    rejected: bookings.filter(b => b.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="max-w-sm w-full border-slate-200">
          <CardContent className="py-10 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No Business Registered
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Register your business to start receiving bookings.
            </p>
            <Link to={createPageUrl('ProviderRegister')}>
              <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                Register Business
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', fontFamily: 'var(--font-sans)' }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50" style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ color: 'var(--text)' }}>Marry.mk</span>
              <span className="text-xs hidden sm:block" style={{ color: 'var(--text-light)' }}>Dashboard</span>
            </div>
            
            <div className="flex items-center gap-2">
              {provider.is_approved && provider.is_active && (
                <Link 
                  to={createPageUrl('ProviderDetails') + `?slug=${provider.slug}`}
                  target="_blank"
                >
                  <Button variant="ghost" size="sm" style={{ color: 'var(--text-light)' }}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => base44.auth.logout(createPageUrl('Home'))}
                style={{ color: 'var(--text-light)' }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
              {provider.name_en}
            </h1>
            {provider.approval_status === 'pending' && (
              <Badge style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary-dark)' }} className="text-xs">Pending</Badge>
            )}
            {provider.approval_status === 'rejected' && (
              <Badge className="bg-red-50 text-red-700 text-xs">Rejected</Badge>
            )}
            {provider.is_approved && provider.is_active && (
              <Badge className="bg-green-50 text-green-700 text-xs">Active</Badge>
            )}
          </div>
        </div>

        {/* Status Alerts */}
        {provider.approval_status === 'pending' && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-800">
              Your business is pending approval.
            </AlertDescription>
          </Alert>
        )}

        {provider.approval_status === 'rejected' && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-sm text-red-800">
              Registration rejected.{provider.rejection_reason && ` ${provider.rejection_reason}`}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <StatsCard title="Total" value={stats.total} icon={CalendarDays} color="primary" />
          <StatsCard title="Pending" value={stats.pending} icon={Clock} color="accent" />
          <StatsCard title="Accepted" value={stats.accepted} icon={CheckCircle2} color="green" />
          <StatsCard title="Rejected" value={stats.rejected} icon={XCircle} color="red" />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full sm:w-auto p-1 h-auto" style={{ backgroundColor: 'var(--bg-light)' }}>
            <TabsTrigger value="overview" className="text-sm px-3 py-1.5" style={{ color: 'var(--text)' }}>
              Bookings
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-sm px-3 py-1.5" style={{ color: 'var(--text)' }}>
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            {/* Booking Filters */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {['all', 'pending', 'accepted', 'rejected'].map((filter) => (
                <Button
                  key={filter}
                  variant={bookingFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBookingFilter(filter)}
                  style={bookingFilter === filter 
                    ? { backgroundColor: 'var(--primary)', color: 'white' }
                    : { borderColor: 'var(--border)', color: 'var(--text)' }
                  }
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  {filter !== 'all' && stats[filter] > 0 && (
                    <span className="ml-1 text-xs opacity-70">{stats[filter]}</span>
                  )}
                </Button>
              ))}
            </div>

            {/* Bookings List */}
            {filteredBookings.length > 0 ? (
              <div className="space-y-3">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onAccept={handleAcceptBooking}
                    onReject={handleRejectBooking}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-slate-200">
                <CardContent className="py-10 text-center">
                  <CalendarDays className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No bookings yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <Card className="border-slate-200">
              <CardHeader className="px-4 sm:px-6 py-4">
                <CardTitle className="text-base">Business Information</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <ProviderForm 
                  provider={provider} 
                  onSave={handleSaveProvider} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
