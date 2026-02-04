import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, Upload, X, ImagePlus } from 'lucide-react';

const categories = [
  { value: 'wedding_hall', label: 'Wedding Hall' },
  { value: 'service', label: 'Service (Salon, Decorator, etc.)' }
];

const currencies = [
  { value: 'EUR', label: '€ EUR' },
  { value: 'MKD', label: 'ден MKD' },
  { value: 'ALL', label: 'L ALL' }
];

export default function ProviderForm({ provider, onSave, isNew = false }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    category: '',
    service_type: '',
    slug: '',
    name_en: '',
    name_sq: '',
    name_mk: '',
    description_en: '',
    description_sq: '',
    description_mk: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    capacity: '',
    price_per_event: '',
    currency: 'EUR',
    working_hours: '',
    cover_image: '',
    images: [],
    amenities: []
  });

  useEffect(() => {
    if (provider) {
      setFormData({
        category: provider.category || '',
        service_type: provider.service_type || '',
        slug: provider.slug || '',
        name_en: provider.name_en || '',
        name_sq: provider.name_sq || '',
        name_mk: provider.name_mk || '',
        description_en: provider.description_en || '',
        description_sq: provider.description_sq || '',
        description_mk: provider.description_mk || '',
        phone: provider.phone || '',
        email: provider.email || '',
        address: provider.address || '',
        city: provider.city || '',
        capacity: provider.capacity || '',
        price_per_event: provider.price_per_event || '',
        currency: provider.currency || 'EUR',
        working_hours: provider.working_hours || '',
        cover_image: provider.cover_image || '',
        images: provider.images || [],
        amenities: provider.amenities || []
      });
    }
  }, [provider]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (value) => {
    setFormData(prev => ({
      ...prev,
      name_en: value,
      slug: isNew ? generateSlug(value) : prev.slug
    }));
  };

  const handleImageUpload = async (e, isCover = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    
    if (isCover) {
      setFormData(prev => ({ ...prev, cover_image: file_url }));
    } else {
      setFormData(prev => ({ ...prev, images: [...prev.images, file_url] }));
    }
    setUploading(false);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const data = {
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      price_per_event: formData.price_per_event ? parseFloat(formData.price_per_event) : null
    };

    await onSave(data);
    setSuccess(true);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <AlertDescription>Provider saved successfully!</AlertDescription>
        </Alert>
      )}

      {/* Basic Info */}
      <Card style={{ border: '1px solid var(--border)' }}>
        <CardHeader>
          <CardTitle className="text-lg" style={{ color: 'var(--text)' }}>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value, service_type: value === 'wedding_hall' ? '' : formData.service_type})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.category === 'service' && (
              <div className="space-y-2">
                <Label>Service Type *</Label>
                <Input
                  value={formData.service_type}
                  onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                  placeholder="e.g., Hair Salon, Nail Salon, Photographer, DJ..."
                  required
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>URL Slug *</Label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: generateSlug(e.target.value)})}
              placeholder="my-business-name"
              required
            />
            <p className="text-xs" style={{ color: 'var(--text-light)' }}>
              This will be your unique URL: /providers/{formData.slug || 'your-slug'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Multilingual Names & Descriptions */}
      <Card style={{ border: '1px solid var(--border)' }}>
        <CardHeader>
          <CardTitle className="text-lg" style={{ color: 'var(--text)' }}>Name & Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en" className="w-full">
            <TabsList className="grid w-full grid-cols-3" style={{ backgroundColor: 'var(--bg-light)' }}>
              <TabsTrigger value="en" style={{ color: 'var(--text)' }}>EN</TabsTrigger>
              <TabsTrigger value="sq" style={{ color: 'var(--text)' }}>SQ</TabsTrigger>
              <TabsTrigger value="mk" style={{ color: 'var(--text)' }}>MK</TabsTrigger>
            </TabsList>
            <TabsContent value="en" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Business Name (English) *</Label>
                <Input
                  value={formData.name_en}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Your Business Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description (English)</Label>
                <Textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                  placeholder="Describe your business..."
                  rows={4}
                />
              </div>
            </TabsContent>
            <TabsContent value="sq" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Business Name (Albanian)</Label>
                <Input
                  value={formData.name_sq}
                  onChange={(e) => setFormData({...formData, name_sq: e.target.value})}
                  placeholder="Emri i Biznesit"
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Albanian)</Label>
                <Textarea
                  value={formData.description_sq}
                  onChange={(e) => setFormData({...formData, description_sq: e.target.value})}
                  placeholder="Përshkruani biznesin tuaj..."
                  rows={4}
                />
              </div>
            </TabsContent>
            <TabsContent value="mk" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Business Name (Macedonian)</Label>
                <Input
                  value={formData.name_mk}
                  onChange={(e) => setFormData({...formData, name_mk: e.target.value})}
                  placeholder="Име на Бизнисот"
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Macedonian)</Label>
                <Textarea
                  value={formData.description_mk}
                  onChange={(e) => setFormData({...formData, description_mk: e.target.value})}
                  placeholder="Опишете го вашиот бизнис..."
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Contact & Location */}
      <Card style={{ border: '1px solid var(--border)' }}>
        <CardHeader>
          <CardTitle className="text-lg" style={{ color: 'var(--text)' }}>Contact & Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+389 XX XXX XXX"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="contact@business.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City *</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="Skopje"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Street address"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Working Hours</Label>
            <Input
              value={formData.working_hours}
              onChange={(e) => setFormData({...formData, working_hours: e.target.value})}
              placeholder="Mon-Sat: 9:00 AM - 6:00 PM"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Capacity */}
      <Card style={{ border: '1px solid var(--border)' }}>
        <CardHeader>
          <CardTitle className="text-lg" style={{ color: 'var(--text)' }}>Pricing & Capacity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Price per Event</Label>
              <Input
                type="number"
                min="0"
                value={formData.price_per_event}
                onChange={(e) => setFormData({...formData, price_per_event: e.target.value})}
                placeholder="1000"
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({...formData, currency: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(c => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Capacity (guests)</Label>
              <Input
                type="number"
                min="0"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                placeholder="200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card style={{ border: '1px solid var(--border)' }}>
        <CardHeader>
          <CardTitle className="text-lg" style={{ color: 'var(--text)' }}>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Cover Image</Label>
            {formData.cover_image ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <img 
                  src={formData.cover_image} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setFormData({...formData, cover_image: ''})}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors" style={{ borderColor: 'var(--border)' }}>
                <ImagePlus className="h-8 w-8 mb-2" style={{ color: 'var(--text-light)' }} />
                <span className="text-sm" style={{ color: 'var(--text-light)' }}>Click to upload cover image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, true)}
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          {/* Gallery Images */}
          <div className="space-y-2">
            <Label>Gallery Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer transition-colors" style={{ borderColor: 'var(--border)' }}>
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--text-light)' }} />
                ) : (
                  <>
                    <Upload className="h-6 w-6 mb-1" style={{ color: 'var(--text-light)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-light)' }}>Add image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, false)}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading} className="min-w-[140px]" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
