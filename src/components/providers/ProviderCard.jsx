import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MapPin, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { createPageUrl } from '@/utils';

export default function ProviderCard({ provider, index = 0 }) {
  const { t, getLocalizedField } = useLanguage();
  
  const name = getLocalizedField(provider, 'name');
  const description = getLocalizedField(provider, 'description');

  const formatPrice = (price, currency = 'EUR') => {
    const symbols = { EUR: '€', MKD: 'ден', ALL: 'L' };
    return `${symbols[currency] || currency} ${price?.toLocaleString() || '0'}`;
  };

  const categoryLabel = provider.category === 'wedding_hall' 
    ? t('wedding_hall') 
    : provider.service_type || t('service');

  return (
    <div className="rounded-lg overflow-hidden transition-colors" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
      <div className="relative h-44 sm:h-48 overflow-hidden" style={{ backgroundColor: 'var(--bg-light)' }}>
        {provider.cover_image ? (
          <img 
            src={provider.cover_image} 
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-light)' }}>
            <span className="text-sm" style={{ color: 'var(--text-light)' }}>{categoryLabel}</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--text)' }}>
            {categoryLabel}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium line-clamp-1" style={{ color: 'var(--text)' }}>
            {name}
          </h3>
          {provider.price_per_event && (
            <span className="font-semibold text-sm whitespace-nowrap" style={{ color: 'var(--primary)' }}>
              {formatPrice(provider.price_per_event, provider.currency)}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3 text-sm mb-3" style={{ color: 'var(--text-light)' }}>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{provider.city}</span>
          </div>
          {provider.capacity && (
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{provider.capacity}</span>
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-light)' }}>
            {description}
          </p>
        )}
        
        <Link to={createPageUrl('ProviderDetails') + `?slug=${provider.slug}`}>
          <Button className="w-full h-10 text-sm" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
            {t('viewDetails')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
