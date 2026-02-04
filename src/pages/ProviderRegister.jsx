import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';
import { createPageUrl } from '@/utils';
import ProviderForm from '../components/dashboard/ProviderForm';

export default function ProviderRegister() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [existingProvider, setExistingProvider] = useState(null);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authenticated = await base44.auth.isAuthenticated();
    if (authenticated) {
      const userData = await base44.auth.me();
      setUser(userData);
      
      // Check if user already has a provider
      const providers = await base44.entities.ServiceProvider.filter({
        owner_email: userData.email
      });
      
      if (providers.length > 0) {
        setExistingProvider(providers[0]);
      }
    }
    setLoading(false);
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin(createPageUrl('ProviderRegister'));
  };

  const handleSave = async (data) => {
    const providerData = {
      ...data,
      owner_email: user.email,
      is_active: false,
      is_approved: false,
      approval_status: 'pending'
    };

    await base44.entities.ServiceProvider.create(providerData);
    setRegistered(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', fontFamily: 'var(--font-sans)' }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50" style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link to={createPageUrl('Home')} className="font-semibold" style={{ color: 'var(--text)' }}>
              Marry.mk
            </Link>
            
            {user && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => base44.auth.logout(createPageUrl('Home'))}
                style={{ color: 'var(--text-light)' }}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
        <Link 
          to={createPageUrl('Home')} 
          className="inline-flex items-center text-sm mb-4"
          style={{ color: 'var(--text-light)' }}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Link>

        {!user ? (
          <Card className="max-w-sm mx-auto" style={{ border: '1px solid var(--border)' }}>
            <CardHeader className="text-center pb-2 px-4 sm:px-6">
              <CardTitle className="text-xl" style={{ color: 'var(--text)' }}>Register Your Business</CardTitle>
              <CardDescription className="text-sm" style={{ color: 'var(--text-light)' }}>
                Sign in to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <Button 
                onClick={handleLogin}
                className="w-full h-11"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign In to Continue
              </Button>
            </CardContent>
          </Card>
        ) : existingProvider ? (
          <Card className="max-w-sm mx-auto" style={{ border: '1px solid var(--border)' }}>
            <CardContent className="py-10 text-center">
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text)' }}>
                Business Already Registered
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-light)' }}>
                {existingProvider.name_en}
              </p>
              <Link to={createPageUrl('ProviderDashboard')}>
                <Button style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : registered ? (
          <Card className="max-w-sm mx-auto" style={{ border: '1px solid var(--border)' }}>
            <CardContent className="py-10 text-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text)' }}>
                Registration Submitted
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-light)' }}>
                Your registration is under review.
              </p>
              <Link to={createPageUrl('ProviderDashboard')}>
                <Button style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div>
            <div className="mb-4">
              <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>
                Register Your Business
              </h1>
            </div>

            <Alert className="mb-4" style={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)' }}>
              <AlertDescription className="text-sm" style={{ color: 'var(--text-light)' }}>
                Your registration will be reviewed by our team.
              </AlertDescription>
            </Alert>

            <ProviderForm onSave={handleSave} isNew={true} />
          </div>
        )}
      </div>
    </div>
  );
}
