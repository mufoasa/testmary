import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Search } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { LanguageProvider, useLanguage } from '../components/providers/LanguageContext';
import LanguageSwitcher from '../components/providers/LanguageSwitcher';
import ProviderCard from '../components/providers/ProviderCard';
import ProviderFilters from '../components/providers/ProviderFilters';

function ProvidersContent() {
  const { t, getLocalizedField } = useLanguage();
  const location = useLocation();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const typeParam = params.get('type');
    
    if (searchParam) setSearch(searchParam);
    if (typeParam) setSelectedType(typeParam);
    
    loadProviders();
  }, []);

  const loadProviders = async () => {
    const data = await base44.entities.ServiceProvider.filter({
      is_approved: true,
      is_active: true
    }, '-created_date');
    
    setProviders(data);
    const uniqueCities = [...new Set(data.map(p => p.city).filter(Boolean))];
    setCities(uniqueCities);
    setLoading(false);
  };

  const filteredProviders = providers.filter(provider => {
    const name = getLocalizedField(provider, 'name');
    const description = getLocalizedField(provider, 'description');
    
    const matchesSearch = !search || 
      name?.toLowerCase().includes(search.toLowerCase()) ||
      description?.toLowerCase().includes(search.toLowerCase()) ||
      provider.city?.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = selectedType === 'all' || provider.category === selectedType;
    const matchesCity = !selectedCity || provider.city === selectedCity;
    
    return matchesSearch && matchesType && matchesCity;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', fontFamily: 'var(--font-sans)' }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50" style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link to={createPageUrl('Home')} className="font-semibold text-lg" style={{ color: 'var(--text)' }}>
              Marry.mk
            </Link>
            
            <div className="flex items-center gap-2">
              <LanguageSwitcher variant="ghost" />
              <Link to={createPageUrl('ProviderLogin')}>
                <Button variant="outline" size="sm" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>{t('login')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Link 
            to={createPageUrl('Home')} 
            className="inline-flex items-center text-sm mb-3"
            style={{ color: 'var(--text-light)' }}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>
            {t('providers')}
          </h1>
        </div>

        {/* Filters */}
        <div className="mb-4 sm:mb-6">
          <ProviderFilters
            search={search}
            setSearch={setSearch}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            cities={cities}
          />
        </div>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-sm" style={{ color: 'var(--text-light)' }}>
            {filteredProviders.length} {filteredProviders.length === 1 ? 'provider' : 'providers'} found
          </p>
        </div>

        {/* Provider Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-9 w-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProviders.map((provider, index) => (
              <ProviderCard key={provider.id} provider={provider} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--bg-light)' }}>
              <Search className="h-6 w-6" style={{ color: 'var(--text-light)' }} />
            </div>
            <h3 className="text-base font-medium mb-2" style={{ color: 'var(--text)' }}>No providers found</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-light)' }}>Try adjusting your filters</p>
            <Button 
              variant="outline" 
              size="sm"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              onClick={() => {
                setSearch('');
                setSelectedType('all');
                setSelectedCity('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Providers() {
  return (
    <LanguageProvider>
      <ProvidersContent />
    </LanguageProvider>
  );
}
