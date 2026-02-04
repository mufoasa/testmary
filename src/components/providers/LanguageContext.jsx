import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navigation
    home: 'Home',
    providers: 'Providers',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    logout: 'Logout',
    
    // Landing
    heroTitle: 'Find & Book Your Perfect Venue',
    heroSubtitle: 'Discover wedding halls, salons, decorators and more for your special occasions',
    searchPlaceholder: 'Search providers...',
    browseProviders: 'Browse Providers',
    featuredProviders: 'Featured Providers',
    viewAll: 'View All',
    
    // Provider Types
    wedding_hall: 'Wedding Hall',
    wedding_halls: 'Wedding Halls',
    service: 'Service',
    services: 'Services',
    all: 'All',
    
    // Provider Card
    capacity: 'Capacity',
    guests: 'guests',
    startingFrom: 'Starting from',
    perEvent: 'per event',
    viewDetails: 'View Details',
    bookNow: 'Book Now',
    
    // Booking Form
    bookingTitle: 'Book This Venue',
    yourName: 'Your Name',
    phoneNumber: 'Phone Number',
    email: 'Email (Optional)',
    eventDate: 'Event Date',
    eventType: 'Event Type',
    numberOfGuests: 'Number of Guests',
    specialRequests: 'Special Requests (Optional)',
    submitBooking: 'Submit Booking Request',
    bookingSuccess: 'Your booking request has been submitted successfully!',
    bookingError: 'This date is already booked. Please choose another date.',
    
    // Event Types
    wedding: 'Wedding',
    birthday: 'Birthday Party',
    corporate: 'Corporate Event',
    anniversary: 'Anniversary',
    engagement: 'Engagement',
    graduation: 'Graduation',
    
    // Status
    pending: 'Pending',
    accepted: 'Accepted',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
    
    // Provider Dashboard
    myProvider: 'My Business',
    editProfile: 'Edit Profile',
    myBookings: 'My Bookings',
    noBookings: 'No bookings yet',
    acceptBooking: 'Accept',
    rejectBooking: 'Reject',
    
    // Admin
    adminPanel: 'Admin Panel',
    allProviders: 'All Providers',
    pendingApproval: 'Pending Approval',
    allBookings: 'All Bookings',
    reservedDates: 'Reserved Dates',
    approve: 'Approve',
    reject: 'Reject',
    activate: 'Activate',
    deactivate: 'Deactivate',
    addReservedDate: 'Add Reserved Date',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    required: 'Required',
    city: 'City',
    address: 'Address',
    phone: 'Phone',
    price: 'Price',
    description: 'Description',
    amenities: 'Amenities',
  },
  sq: {
    // Navigation
    home: 'Ballina',
    providers: 'Ofruesit',
    login: 'Hyr',
    register: 'Regjistrohu',
    dashboard: 'Paneli',
    logout: 'Dil',
    
    // Landing
    heroTitle: 'Gjeni & Rezervoni Vendin Tuaj të Përkryer',
    heroSubtitle: 'Zbuloni sallat e dasmave, sallonet, dekoratorët dhe më shumë për rastet tuaja speciale',
    searchPlaceholder: 'Kërko ofruesit...',
    browseProviders: 'Shfleto Ofruesit',
    featuredProviders: 'Ofruesit e Veçantë',
    viewAll: 'Shiko të Gjitha',
    
    // Provider Types
    wedding_hall: 'Sallë Dasmash',
    wedding_halls: 'Sallat e Dasmave',
    service: 'Shërbim',
    services: 'Shërbimet',
    all: 'Të Gjitha',
    
    // Provider Card
    capacity: 'Kapaciteti',
    guests: 'mysafirë',
    startingFrom: 'Duke filluar nga',
    perEvent: 'për event',
    viewDetails: 'Shiko Detajet',
    bookNow: 'Rezervo Tani',
    
    // Booking Form
    bookingTitle: 'Rezervo Këtë Vend',
    yourName: 'Emri Juaj',
    phoneNumber: 'Numri i Telefonit',
    email: 'Email (Opsional)',
    eventDate: 'Data e Eventit',
    eventType: 'Lloji i Eventit',
    numberOfGuests: 'Numri i Mysafirëve',
    specialRequests: 'Kërkesa Speciale (Opsional)',
    submitBooking: 'Dërgo Kërkesën për Rezervim',
    bookingSuccess: 'Kërkesa juaj për rezervim u dërgua me sukses!',
    bookingError: 'Kjo datë është e rezervuar tashmë. Ju lutem zgjidhni një datë tjetër.',
    
    // Event Types
    wedding: 'Dasmë',
    birthday: 'Ditëlindje',
    corporate: 'Event Korporativ',
    anniversary: 'Përvjetor',
    engagement: 'Fejsë',
    graduation: 'Diplomim',
    
    // Status
    pending: 'Në Pritje',
    accepted: 'Pranuar',
    rejected: 'Refuzuar',
    cancelled: 'Anuluar',
    
    // Provider Dashboard
    myProvider: 'Biznesi Im',
    editProfile: 'Edito Profilin',
    myBookings: 'Rezervimet e Mia',
    noBookings: 'Nuk ka rezervime ende',
    acceptBooking: 'Prano',
    rejectBooking: 'Refuzo',
    
    // Admin
    adminPanel: 'Paneli i Adminit',
    allProviders: 'Të Gjithë Ofruesit',
    pendingApproval: 'Në Pritje për Aprovim',
    allBookings: 'Të Gjitha Rezervimet',
    reservedDates: 'Datat e Rezervuara',
    approve: 'Aprovo',
    reject: 'Refuzo',
    activate: 'Aktivizo',
    deactivate: 'Çaktivizo',
    addReservedDate: 'Shto Datë të Rezervuar',
    
    // Common
    save: 'Ruaj',
    cancel: 'Anulo',
    delete: 'Fshi',
    edit: 'Edito',
    loading: 'Duke Ngarkuar...',
    error: 'Gabim',
    success: 'Sukses',
    required: 'E detyrueshme',
    city: 'Qyteti',
    address: 'Adresa',
    phone: 'Telefoni',
    price: 'Çmimi',
    description: 'Përshkrimi',
    amenities: 'Përfitimet',
  },
  mk: {
    // Navigation
    home: 'Дома',
    providers: 'Даватели',
    login: 'Најави се',
    register: 'Регистрирај се',
    dashboard: 'Табла',
    logout: 'Одјави се',
    
    // Landing
    heroTitle: 'Најдете и Резервирајте Совршено Место',
    heroSubtitle: 'Откријте свадбени сали, салони, декоратори и повеќе за вашите специјални настани',
    searchPlaceholder: 'Пребарај даватели...',
    browseProviders: 'Прегледај Даватели',
    featuredProviders: 'Истакнати Даватели',
    viewAll: 'Види Сите',
    
    // Provider Types
    wedding_hall: 'Свадбена Сала',
    wedding_halls: 'Свадбени Сали',
    service: 'Услуга',
    services: 'Услуги',
    all: 'Сите',
    
    // Provider Card
    capacity: 'Капацитет',
    guests: 'гости',
    startingFrom: 'Почнувајќи од',
    perEvent: 'по настан',
    viewDetails: 'Види Детали',
    bookNow: 'Резервирај Сега',
    
    // Booking Form
    bookingTitle: 'Резервирај го ова Место',
    yourName: 'Вашето Име',
    phoneNumber: 'Телефонски Број',
    email: 'Емаил (Опционално)',
    eventDate: 'Датум на Настан',
    eventType: 'Тип на Настан',
    numberOfGuests: 'Број на Гости',
    specialRequests: 'Специјални Барања (Опционално)',
    submitBooking: 'Поднеси Барање за Резервација',
    bookingSuccess: 'Вашето барање за резервација е успешно поднесено!',
    bookingError: 'Овој датум е веќе резервиран. Ве молиме изберете друг датум.',
    
    // Event Types
    wedding: 'Свадба',
    birthday: 'Роденден',
    corporate: 'Корпоративен Настан',
    anniversary: 'Годишнина',
    engagement: 'Веридба',
    graduation: 'Дипломирање',
    
    // Status
    pending: 'Во Тек',
    accepted: 'Прифатено',
    rejected: 'Одбиено',
    cancelled: 'Откажано',
    
    // Provider Dashboard
    myProvider: 'Мој Бизнис',
    editProfile: 'Уреди Профил',
    myBookings: 'Мои Резервации',
    noBookings: 'Нема резервации уште',
    acceptBooking: 'Прифати',
    rejectBooking: 'Одбиј',
    
    // Admin
    adminPanel: 'Админ Панел',
    allProviders: 'Сите Даватели',
    pendingApproval: 'Чека Одобрување',
    allBookings: 'Сите Резервации',
    reservedDates: 'Резервирани Датуми',
    approve: 'Одобри',
    reject: 'Одбиј',
    activate: 'Активирај',
    deactivate: 'Деактивирај',
    addReservedDate: 'Додај Резервиран Датум',
    
    // Common
    save: 'Зачувај',
    cancel: 'Откажи',
    delete: 'Избриши',
    edit: 'Уреди',
    loading: 'Се Вчитува...',
    error: 'Грешка',
    success: 'Успех',
    required: 'Задолжително',
    city: 'Град',
    address: 'Адреса',
    phone: 'Телефон',
    price: 'Цена',
    description: 'Опис',
    amenities: 'Погодности',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('preferred_language');
    if (saved && translations[saved]) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('preferred_language', lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const getLocalizedField = (item, field) => {
    const langField = `${field}_${language}`;
    return item?.[langField] || item?.[`${field}_en`] || item?.[field] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, getLocalizedField }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
