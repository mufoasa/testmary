import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { LanguageProvider, useLanguage } from '../components/providers/LanguageContext';
import LanguageSwitcher from '../components/providers/LanguageSwitcher';
import BookingForm from '../components/providers/BookingForm';

function ProviderDetailsContent() {
  const { t, getLocalizedField } = useLanguage();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    loadProvider();
  }, []);

  const loadProvider = async () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    
    if (!slug) {
      setLoading(false);
      return;
    }

    const providers = await base44.entities.ServiceProvider.filter({ slug });
    if (providers.length > 0 && providers[0].is_approved && providers[0].is_active) {
      setProvider(providers[0]);
    }
    setLoading(false);
  };

  const name = getLocalizedField(provider, 'name');
  const description = getLocalizedField(provider, 'description');

  const allImages = provider ? [
    provider.cover_image,
    ...(provider.images || [])
  ].filter(Boolean) : [];

  const formatPrice = (price, currency = 'EUR') => {
    const symbols = { EUR: '€', MKD: 'ден', ALL: 'L' };
    return `${symbols[currency] || currency} ${price?.toLocaleString() || '0'}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </nav>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Skeleton className="h-64 sm:h-80 w-full rounded-lg mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-lg font-medium text-slate-900 mb-3">Provider not found</h1>
          <Link to={createPageUrl('Providers')}>
            <Button size="sm">Browse Providers</Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel = provider.category === 'wedding_hall' 
    ? t('wedding_hall') 
    : provider.service_type || t('service');

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', fontFamily: 'var(--font-sans)' }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50" style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link to={createPageUrl('Home')} className="font-semibold" style={{ color: 'var(--text)' }}>
              Marry.mk
            </Link>
            
            <LanguageSwitcher variant="ghost" />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {/* Back Button */}
        <Link 
          to={createPageUrl('Providers')} 
          className="inline-flex items-center text-sm mb-3"
          style={{ color: 'var(--text-light)' }}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Link>

        {/* Image Gallery */}
        {allImages.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <div className="relative rounded-lg overflow-hidden h-56 sm:h-72 md:h-96 bg-slate-100">
              <img
                src={allImages[activeImage]}
                alt={name}
                className="w-full h-full object-cover"
              />
              
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage(prev => prev === 0 ? allImages.length - 1 : prev - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full shadow"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveImage(prev => prev === allImages.length - 1 ? 0 : prev + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full shadow"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {allImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-1.5 h-1.5 rounded-full ${
                        index === activeImage ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${
                      index === activeImage ? 'border-rose-400' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Provider Info */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-sm" style={{ color: 'var(--text-light)' }}>{categoryLabel}</span>
                {provider.capacity && (
                  <span className="text-sm" style={{ color: 'var(--text-light)' }}>
                    · {provider.capacity} {t('guests')}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                {name}
              </h1>

              <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-light)' }}>
                <MapPin className="h-4 w-4" />
                <span>{provider.city}</span>
                {provider.address && <span>· {provider.address}</span>}
              </div>
            </div>

            {/* Price */}
            {provider.price_per_event && (
              <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-light)' }}>
                <div className="text-xs" style={{ color: 'var(--text-light)' }}>{t('startingFrom')}</div>
                <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                  {formatPrice(provider.price_per_event, provider.currency)}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-light)' }}>{t('perEvent')}</div>
              </div>
            )}

            {/* Description */}
            {description && (
              <div>
                <h2 className="text-base font-medium mb-2" style={{ color: 'var(--text)' }}>
                  {t('description')}
                </h2>
                <p className="text-sm whitespace-pre-line" style={{ color: 'var(--text-light)' }}>
                  {description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {provider.amenities && provider.amenities.length > 0 && (
              <div>
                <h2 className="text-base font-medium mb-2" style={{ color: 'var(--text)' }}>
                  {t('amenities')}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {provider.amenities.map((amenity, index) => (
                    <span key={index} className="text-sm px-2.5 py-1 rounded" style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-light)' }}>
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="rounded-lg p-4" style={{ border: '1px solid var(--border)' }}>
              <h2 className="text-base font-medium mb-3" style={{ color: 'var(--text)' }}>
                Contact
              </h2>
              <div className="space-y-2">
                {provider.phone && (
                  <a 
                    href={`tel:${provider.phone}`}
                    className="flex items-center gap-2 text-sm hover:underline"
                    style={{ color: 'var(--text-light)' }}
                  >
                    <Phone className="h-4 w-4" />
                    <span>{provider.phone}</span>
                  </a>
                )}
                {provider.email && (
                  <a 
                    href={`mailto:${provider.email}`}
                    className="flex items-center gap-2 text-sm hover:underline"
                    style={{ color: 'var(--text-light)' }}
                  >
                    <Mail className="h-4 w-4" />
                    <span>{provider.email}</span>
                  </a>
                )}
                {provider.working_hours && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-light)' }}>
                    <Clock className="h-4 w-4" />
                    <span>{provider.working_hours}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:sticky lg:top-20">
            <BookingForm provider={provider} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProviderDetails() {
  return (
    <LanguageProvider>
      <ProviderDetailsContent />
    </LanguageProvider>
  );
}
