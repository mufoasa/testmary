import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ArrowRight, 
  Calendar, 
  Shield, 
  Clock,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { LanguageProvider, useLanguage } from '../components/providers/LanguageContext';
import LanguageSwitcher from '../components/providers/LanguageSwitcher';
import ProviderCard from '../components/providers/ProviderCard';

function HomeContent() {
  const { t } = useLanguage();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadFeaturedProviders();
  }, []);

  const loadFeaturedProviders = async () => {
    const data = await base44.entities.ServiceProvider.filter({
      is_approved: true,
      is_active: true
    }, '-created_date', 6);
    setProviders(data);
    setLoading(false);
  };

  const handleSearch = () => {
    window.location.href = createPageUrl('Providers') + `?search=${encodeURIComponent(search)}`;
  };

  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Book your venue in minutes without creating an account'
    },
    {
      icon: Shield,
      title: 'Verified Providers',
      description: 'All providers are verified and approved by our team'
    },
    {
      icon: Clock,
      title: 'Real-time Availability',
      description: 'See available dates instantly and book with confidence'
    }
  ];

  const categoriesList = [
    { type: 'wedding_hall', labelKey: 'wedding_halls' },
    { type: 'service', labelKey: 'services' }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', fontFamily: 'var(--font-sans)' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <span className="font-semibold text-lg sm:text-xl tracking-tight" style={{ color: '#b8895f' }}>Marry<span style={{ color: '#d4a574' }}>.mk</span></span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden sm:flex items-center gap-2">
              <LanguageSwitcher variant="ghost" />
              <Link to={createPageUrl('Providers')}>
                <Button variant="ghost" size="sm" style={{ color: 'var(--text)' }}>{t('providers')}</Button>
              </Link>
              <Link to={createPageUrl('ProviderLogin')}>
                <Button size="sm" className="transition-all hover:shadow-md" style={{ backgroundColor: '#d4a574', color: '#ffffff' }}>
                  {t('login')}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="sm:hidden p-2 -mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: 'var(--text)' }}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden py-4" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex flex-col gap-2">
                <Link to={createPageUrl('Providers')} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start" style={{ color: 'var(--text)' }}>{t('providers')}</Button>
                </Link>
                <Link to={createPageUrl('ProviderLogin')} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full" style={{ backgroundColor: '#d4a574', color: '#ffffff' }}>
                    {t('login')}
                  </Button>
                </Link>
                <div className="pt-2">
                  <LanguageSwitcher variant="ghost" />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 sm:pt-28 pb-12 sm:pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: 'var(--text)' }}>
              {t('heroTitle')}
            </h1>
            
            <p className="text-base sm:text-lg mb-8" style={{ color: 'var(--text-light)' }}>
              {t('heroSubtitle')}
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-light)' }} />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="h-12 px-6 transition-all hover:shadow-md"
                style={{ backgroundColor: '#d4a574', color: '#ffffff' }}
              >
                {t('browseProviders')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {categoriesList.map((cat) => (
                <Link 
                  key={cat.type}
                  to={createPageUrl('Providers') + `?type=${cat.type}`}
                >
                  <Button variant="outline" size="sm" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} className="hover:bg-[var(--secondary)]">
                    {t(cat.labelKey)}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 px-4" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--secondary)' }}>
                  <feature.icon className="h-6 w-6" style={{ color: 'var(--primary)' }} />
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>
                  {feature.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-light)' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      {providers.length > 0 && (
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>
                  {t('featuredProviders')}
                </h2>
              </div>
              <Link to={createPageUrl('Providers')}>
                <Button variant="ghost" size="sm" style={{ color: 'var(--primary)' }}>
                  {t('viewAll')}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {providers.map((provider, index) => (
                <ProviderCard key={provider.id} provider={provider} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl p-6 sm:p-10 text-center" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
            <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>
              Are you a service provider?
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-light)' }}>
              Join our platform and reach thousands of potential clients
            </p>
            <Link to={createPageUrl('ProviderRegister')}>
              <Button className="h-11 px-6 transition-all hover:shadow-md" style={{ backgroundColor: '#d4a574', color: '#ffffff' }}>
                Register Your Business
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-semibold tracking-tight" style={{ color: '#b8895f' }}>Marry<span style={{ color: '#d4a574' }}>.mk</span></span>
          <p className="text-sm" style={{ color: 'var(--text-light)' }}>
            © {new Date().getFullYear()} Marry.mk. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  );
}
