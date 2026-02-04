import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const categories = [
  { value: 'all', labelKey: 'all' },
  { value: 'wedding_hall', labelKey: 'wedding_halls' },
  { value: 'service', labelKey: 'services' }
];

export default function ProviderFilters({ 
  search, 
  setSearch, 
  selectedType, 
  setSelectedType,
  selectedCity,
  setSelectedCity,
  cities = []
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-light)' }} />
        <Input
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11"
          style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
        />
        {search && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
            onClick={() => setSearch('')}
          >
            <X className="h-4 w-4" style={{ color: 'var(--text-light)' }} />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedType === cat.value ? "default" : "outline"}
            size="sm"
            style={selectedType === cat.value 
              ? { backgroundColor: 'var(--primary)', color: 'white' }
              : { backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }
            }
            onClick={() => setSelectedType(cat.value)}
          >
            {t(cat.labelKey)}
          </Button>
        ))}
      </div>

      {/* City Filter */}
      {cities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={!selectedCity ? "default" : "outline"}
            size="sm"
            style={!selectedCity 
              ? { backgroundColor: 'var(--primary)', color: 'white' }
              : { backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }
            }
            onClick={() => setSelectedCity('')}
          >
            All Cities
          </Button>
          {cities.map((city) => (
            <Button 
              key={city}
              variant={selectedCity === city ? "default" : "outline"}
              size="sm"
              style={selectedCity === city 
                ? { backgroundColor: 'var(--primary)', color: 'white' }
                : { backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }
              }
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
