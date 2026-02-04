import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, LogIn } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function ProviderLogin() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authenticated = await base44.auth.isAuthenticated();
    if (authenticated) {
      const user = await base44.auth.me();
      // Redirect based on role
      if (user.role === 'admin') {
        window.location.href = createPageUrl('AdminDashboard');
      } else {
        window.location.href = createPageUrl('ProviderDashboard');
      }
    }
    setLoading(false);
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin(createPageUrl('ProviderDashboard'));
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
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link to={createPageUrl('Home')} className="font-semibold" style={{ color: 'var(--text)' }}>
              Marry.mk
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-12 px-4">
        <div className="max-w-sm mx-auto">
          <Link 
            to={createPageUrl('Home')} 
            className="inline-flex items-center text-sm mb-4"
            style={{ color: 'var(--text-light)' }}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>

          <Card style={{ border: '1px solid var(--border)' }}>
            <CardHeader className="text-center pb-2 px-4 sm:px-6">
              <CardTitle className="text-xl" style={{ color: 'var(--text)' }}>Provider Login</CardTitle>
              <CardDescription className="text-sm" style={{ color: 'var(--text-light)' }}>
                Sign in to manage your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <Button 
                onClick={handleLogin}
                className="w-full h-11"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full" style={{ borderTop: '1px solid var(--border)' }} />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-light)' }}>
                    New to Marry.mk?
                  </span>
                </div>
              </div>

              <Link to={createPageUrl('ProviderRegister')}>
                <Button variant="outline" className="w-full h-11" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                  Register Your Business
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
