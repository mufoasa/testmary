import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Building2, 
  CalendarDays, 
  Clock,
  Search,
  Plus,
  Trash2,
  LogOut,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { createPageUrl } from '@/utils';
import ProviderApprovalCard from '../components/admin/ProviderApprovalCard';
import ReservedDateForm from '../components/admin/ReservedDateForm';
import BookingCard from '../components/dashboard/BookingCard';
import StatsCard from '../components/dashboard/StatsCard';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reservedDates, setReservedDates] = useState([]);
  const [activeTab, setActiveTab] = useState('providers');
  const [providerFilter, setProviderFilter] = useState('all');
  const [searchProviders, setSearchProviders] = useState('');
  const [showReservedDateForm, setShowReservedDateForm] = useState(false);
  const [editingReservedDate, setEditingReservedDate] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authenticated = await base44.auth.isAuthenticated();
    if (!authenticated) {
      base44.auth.redirectToLogin(createPageUrl('AdminDashboard'));
      return;
    }
    
    const userData = await base44.auth.me();
    if (userData.role !== 'admin') {
      window.location.href = createPageUrl('ProviderDashboard');
      return;
    }
    
    setUser(userData);
    await loadData();
    setLoading(false);
  };

  const loadData = async () => {
    const [providersData, bookingsData, reservedData] = await Promise.all([
      base44.entities.ServiceProvider.list('-created_date'),
      base44.entities.Booking.list('-created_date'),
      base44.entities.AdminReservedDate.list('-date')
    ]);
    
    setProviders(providersData);
    setBookings(bookingsData);
    setReservedDates(reservedData);
  };

  const handleApproveProvider = async (provider) => {
    await base44.entities.ServiceProvider.update(provider.id, {
      approval_status: 'approved',
      is_approved: true,
      is_active: true
    });
    setProviders(providers.map(p => 
      p.id === provider.id 
        ? { ...p, approval_status: 'approved', is_approved: true, is_active: true }
        : p
    ));
  };

  const handleRejectProvider = async (provider) => {
    const reason = window.prompt('Enter rejection reason (optional):');
    await base44.entities.ServiceProvider.update(provider.id, {
      approval_status: 'rejected',
      is_approved: false,
      is_active: false,
      rejection_reason: reason || null
    });
    setProviders(providers.map(p => 
      p.id === provider.id 
        ? { ...p, approval_status: 'rejected', is_approved: false, is_active: false, rejection_reason: reason }
        : p
    ));
  };

  const handleToggleActive = async (provider) => {
    const newActive = !provider.is_active;
    await base44.entities.ServiceProvider.update(provider.id, { is_active: newActive });
    setProviders(providers.map(p => 
      p.id === provider.id ? { ...p, is_active: newActive } : p
    ));
  };

  const handleViewProvider = (provider) => {
    window.open(createPageUrl('ProviderDetails') + `?slug=${provider.slug}`, '_blank');
  };

  const handleSaveReservedDate = async (data) => {
    if (editingReservedDate) {
      await base44.entities.AdminReservedDate.update(editingReservedDate.id, data);
    } else {
      await base44.entities.AdminReservedDate.create(data);
    }
    await loadData();
    setEditingReservedDate(null);
  };

  const handleDeleteReservedDate = async (date) => {
    if (window.confirm('Are you sure you want to delete this reserved date?')) {
      await base44.entities.AdminReservedDate.delete(date.id);
      setReservedDates(reservedDates.filter(d => d.id !== date.id));
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

  const filteredProviders = providers.filter(p => {
    const matchesSearch = !searchProviders || 
      p.name_en?.toLowerCase().includes(searchProviders.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchProviders.toLowerCase());
    
    if (providerFilter === 'all') return matchesSearch;
    if (providerFilter === 'pending') return matchesSearch && p.approval_status === 'pending';
    if (providerFilter === 'approved') return matchesSearch && p.approval_status === 'approved';
    if (providerFilter === 'active') return matchesSearch && p.is_active;
    return matchesSearch;
  });

  const stats = {
    totalProviders: providers.length,
    pendingApproval: providers.filter(p => p.approval_status === 'pending').length,
    activeProviders: providers.filter(p => p.is_active).length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    reservedDatesCount: reservedDates.length
  };

  const getProviderName = (providerId) => {
    const provider = providers.find(p => p.id === providerId);
    return provider?.name_en || 'Unknown';
  };

  const reasonLabels = {
    cash_payment: 'Cash Payment',
    subscription: 'Subscription',
    maintenance: 'Maintenance',
    holiday: 'Holiday',
    private_event: 'Private Event',
    other: 'Other'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
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
              <Badge variant="outline" className="text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-light)' }}>Admin</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm hidden sm:block" style={{ color: 'var(--text-light)' }}>{user?.email}</span>
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
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>
            Admin Dashboard
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <StatsCard
            title="Providers"
            value={stats.totalProviders}
            icon={Building2}
            color="primary"
          />
          <StatsCard
            title="Pending"
            value={stats.pendingApproval}
            icon={Clock}
            color="accent"
          />
          <StatsCard
            title="Bookings"
            value={stats.totalBookings}
            icon={CalendarDays}
            color="green"
          />
          <StatsCard
            title="Reserved"
            value={stats.reservedDatesCount}
            icon={Calendar}
            color="primary"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full sm:w-auto p-1 h-auto flex-wrap" style={{ backgroundColor: 'var(--bg-light)' }}>
            <TabsTrigger value="providers" className="text-sm px-3 py-1.5" style={{ color: 'var(--text)' }}>
              Providers
              {stats.pendingApproval > 0 && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary-dark)' }}>
                  {stats.pendingApproval}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="bookings" className="text-sm px-3 py-1.5" style={{ color: 'var(--text)' }}>
              Bookings
            </TabsTrigger>
            <TabsTrigger value="reserved" className="text-sm px-3 py-1.5" style={{ color: 'var(--text)' }}>
              Reserved
            </TabsTrigger>
          </TabsList>

          {/* Providers Tab */}
          <TabsContent value="providers" className="mt-4">
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search providers..."
                  value={searchProviders}
                  onChange={(e) => setSearchProviders(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'pending', 'approved', 'active'].map((filter) => (
                  <Button
                    key={filter}
                    variant={providerFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProviderFilter(filter)}
                    className={providerFilter === filter ? 'bg-slate-900' : 'border-slate-200'}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {filteredProviders.length > 0 ? (
              <div className="space-y-3">
                {filteredProviders.map((provider) => (
                  <ProviderApprovalCard
                    key={provider.id}
                    provider={provider}
                    onApprove={handleApproveProvider}
                    onReject={handleRejectProvider}
                    onToggleActive={handleToggleActive}
                    onView={handleViewProvider}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-slate-200">
                <CardContent className="py-12 text-center">
                  <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No providers found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="mt-4">
            {bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onAccept={handleAcceptBooking}
                    onReject={handleRejectBooking}
                    showProviderName={true}
                    providerName={getProviderName(booking.service_provider_id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-slate-200">
                <CardContent className="py-12 text-center">
                  <CalendarDays className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No bookings yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reserved Dates Tab */}
          <TabsContent value="reserved" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-medium text-slate-900">
                Reserved Dates
              </h2>
              <Button 
                size="sm"
                onClick={() => {
                  setEditingReservedDate(null);
                  setShowReservedDateForm(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {reservedDates.length > 0 ? (
              <div className="overflow-x-auto">
                <Card className="border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Provider</TableHead>
                        <TableHead className="text-xs">Reason</TableHead>
                        <TableHead className="text-xs hidden sm:table-cell">Client</TableHead>
                        <TableHead className="text-xs hidden sm:table-cell">Amount</TableHead>
                        <TableHead className="text-xs w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservedDates.map((date) => (
                        <TableRow key={date.id}>
                          <TableCell className="text-sm">
                            {format(new Date(date.date), 'MMM d')}
                          </TableCell>
                          <TableCell className="text-sm">{getProviderName(date.service_provider_id)}</TableCell>
                          <TableCell>
                            <span className="text-xs text-slate-600">
                              {reasonLabels[date.reason] || date.reason}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm hidden sm:table-cell">{date.client_name || '-'}</TableCell>
                          <TableCell className="text-sm hidden sm:table-cell">
                            {date.amount_paid ? `€${date.amount_paid}` : '-'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReservedDate(date)}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            ) : (
              <Card className="border-slate-200">
                <CardContent className="py-12 text-center">
                  <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 mb-3 text-sm">No reserved dates</p>
                  <Button 
                    size="sm"
                    onClick={() => setShowReservedDateForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Reserved Date Form Modal */}
      <ReservedDateForm
        open={showReservedDateForm}
        onClose={() => {
          setShowReservedDateForm(false);
          setEditingReservedDate(null);
        }}
        onSave={handleSaveReservedDate}
        providers={providers}
        existingDate={editingReservedDate}
      />
    </div>
  );
}
