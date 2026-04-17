'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Logo from './Logo';
import ServicesDropdown from './ServicesDropdown';
import { storage, isAuthenticated, clientApi, City, Boat } from '@/lib/api';

interface HeaderProps {
  variant?: 'transparent' | 'solid';
  currentPage?: string;
}

const Header = ({ variant = 'transparent' }: HeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ fullName?: string; email?: string; role?: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [boats, setBoats] = useState<Boat[]>([]);

  type Suggestion = {
    label: string;
    href: string;
    type: 'category' | 'city' | 'boat' | 'service';
    keywords?: string[]
  };

  // Mapping for common Arabic city names to English (for search)
  const cityNameMapping: Record<string, string[]> = {
    'أسوان': ['aswan', 'asuan', 'asswan'],
    'الأقصر': ['luxor', 'al uqsur', 'al uqsor', 'el uqsur'],
    'القاهرة': ['cairo', 'al qahira', 'el qahira'],
    'الإسكندرية': ['alexandria', 'al iskandariyah', 'el iskandariya'],
    'الغردقة': ['hurghada', 'al ghardaqah', 'el ghardaqa'],
    'شرم الشيخ': ['sharm el sheikh', 'sharm el sheik', 'sharm'],
    'مرسى مطروح': ['marsa matruh', 'marsa matrouh'],
    'دهب': ['dahab', 'dahb'],
    'نويبع': ['nuweiba', 'nueiba'],
    'طابا': ['taba'],
  };

  // Mapping for common Arabic category names to English
  const categoryNameMapping: Record<string, string[]> = {
    'مناسبات': ['occasion', 'occasions', 'event', 'events'],
    'أنشطة مائية': ['water activities', 'water activity', 'water sports'],
    'مراكب صيد': ['fishing', 'fishing boats', 'fish'],
    'مراكب خاصة': ['private', 'private boats'],
    'رحلات مشتركة': ['sharing', 'sharing trips', 'shared'],
    'مراكب سفر': ['travel', 'travel boats'],
    'دهبية': ['felucca', 'feluka', 'فلوكة'],
    'يخت': ['yacht', 'yachts'],
  };

  const normalizeArabic = (text: string) =>
    text
      .toLowerCase()
      .replace(/أ|إ|آ|ء/g, 'ا')
      .replace(/ى|ئ/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/ؤ/g, 'و')
      .replace(/[ًٌٍَُِّْ]/g, '') // Remove diacritics
      .replace(/\s+/g, ' ') // collapse spaces
      .trim();

  // Check if query matches with Arabic-English mapping
  const matchesWithMapping = (query: string, source: string, mapping: Record<string, string[]>): boolean => {
    const normalizedQuery = normalizeArabic(query);
    const normalizedSource = normalizeArabic(source);

    // Direct match
    if (normalizedSource.includes(normalizedQuery)) return true;

    // Check Arabic query against English source using mapping
    for (const [arabicName, englishNames] of Object.entries(mapping)) {
      if (normalizeArabic(arabicName).includes(normalizedQuery)) {
        // If query matches Arabic name, check if source matches any English equivalent
        if (englishNames.some(en => normalizedSource.includes(en.toLowerCase()))) {
          return true;
        }
      }
    }

    // Check English query against Arabic source using mapping
    for (const [arabicName, englishNames] of Object.entries(mapping)) {
      if (englishNames.some(en => normalizedQuery.includes(en.toLowerCase()))) {
        // If query matches English name, check if source matches Arabic equivalent
        if (normalizeArabic(arabicName).includes(normalizedSource) || normalizedSource.includes(normalizeArabic(arabicName))) {
          return true;
        }
      }
    }

    return false;
  };

  const tokenStartsWith = (source: string, query: string, type: 'city' | 'category' | 'boat' = 'boat') => {
    const q = normalizeArabic(query);
    if (!q) return false;
    const normalizedSource = normalizeArabic(source);

    // Direct match
    if (normalizedSource.includes(q)) return true;

    // Use mapping for cities and categories
    if (type === 'city') {
      return matchesWithMapping(query, source, cityNameMapping);
    } else if (type === 'category') {
      return matchesWithMapping(query, source, categoryNameMapping);
    }

    // For boats, check both direct match and word-by-word
    return normalizedSource.split(/\s+/).some((tok) => tok.startsWith(q) || tok.includes(q));
  };

  // Load search data on mount
  useEffect(() => {
    const loadSearchData = async () => {
      try {
        // Load cities
        const citiesResponse = await clientApi.getCities();
        if (citiesResponse.success && citiesResponse.data) {
          setCities(citiesResponse.data.cities);
        }

        // Load some boats for search
        const boatsResponse = await clientApi.getBoats(1, 50);
        if (boatsResponse.success && boatsResponse.data) {
          setBoats(boatsResponse.data.boats);
        }

        // Load categories from all cities
        if (citiesResponse.success && citiesResponse.data) {
          const allCategories = new Map<number, { id: number; name: string }>();
          for (const city of citiesResponse.data.cities) {
            try {
              const catResponse = await clientApi.getCategoriesByCity(city.id);
              if (catResponse.success && catResponse.data) {
                const data = catResponse.data;
                const normalized = Array.isArray(data) ? data : [];
                normalized.forEach(cat => {
                  if (!allCategories.has(cat.id)) {
                    allCategories.set(cat.id, { id: cat.id, name: cat.name });
                  }
                });
              }
            } catch {
              // Continue if one city fails
            }
          }
          setCategories(Array.from(allCategories.values()));
        }
      } catch (error) {
        console.error('Error loading search data:', error);
      }
    };

    loadSearchData();
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const userData = storage.getUser();
        if (userData) {
          setUser({
            fullName: userData.username,
            email: userData.email || '',
            role: userData.role || 'user'
          });
        }
      } else {
        setUser(null);
        // Clear storage if token is invalid
        storage.clearAll();
      }
    };

    // Check immediately
    checkAuth();

    // Check periodically (every 30 seconds)
    const interval = setInterval(checkAuth, 30000);

    // Check on storage change (when token is cleared)
    const handleStorageChange = () => {
      checkAuth();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, []);

  // Also check when pathname changes
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const userData = storage.getUser();
        if (userData) {
          setUser({
            fullName: userData.username,
            email: userData.email || '',
            role: userData.role || 'user'
          });
        }
      } else {
        setUser(null);
        storage.clearAll();
      }
    };

    checkAuth();
  }, [pathname]);

  // Generate dynamic search suggestions
  const getSearchSuggestions = (): Suggestion[] => {
    if (!searchQuery.trim()) return [];

    const query = normalizeArabic(searchQuery.trim());
    const suggestions: Suggestion[] = [];

    // Search in categories
    categories.forEach(cat => {
      if (tokenStartsWith(cat.name, query, 'category')) {
        suggestions.push({
          label: cat.name,
          href: `/boat-listing?category_id=${cat.id}`,
          type: 'category',
          keywords: [cat.name]
        });
      }
    });

    // Search in cities
    cities.forEach(city => {
      if (tokenStartsWith(city.name, query, 'city')) {
        suggestions.push({
          label: city.name,
          href: `/boat-listing?city_id=${city.id}`,
          type: 'city',
          keywords: [city.name]
        });
      }
    });

    // Search in boat names
    boats.forEach(boat => {
      if (tokenStartsWith(boat.name, query)) {
        suggestions.push({
          label: boat.name,
          href: `/boat-listing?search=${encodeURIComponent(boat.name)}`,
          type: 'boat',
          keywords: [boat.name, ...(boat.categories || [])]
        });
      }
    });

    // Search in boat types/categories
    boats.forEach(boat => {
      if (boat.categories) {
        boat.categories.forEach(cat => {
          if (tokenStartsWith(cat, query) && !suggestions.some(s => s.label === cat && s.type === 'category')) {
            // Try to find category ID
            const category = categories.find(c => c.name.toLowerCase() === cat.toLowerCase());
            if (category) {
              suggestions.push({
                label: cat,
                href: `/boat-listing?category_id=${category.id}`,
                type: 'category',
                keywords: [cat]
              });
            }
          }
        });
      }
    });

    return suggestions.slice(0, 8);
  };

  const filteredSuggestions = getSearchSuggestions();


  const textColor = variant === 'solid' ? 'text-gray-900' : 'text-white';
  const hoverColor = variant === 'solid' ? 'hover:text-blue-600' : 'hover:text-blue-200';
  const logoVariant = variant === 'solid' ? 'gradient' : 'white';

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Clear token and user data
      storage.clearAll();

      // Clear cookies
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      // Clear remember me data
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('savedUsername');
      localStorage.removeItem('savedPassword');

      setUser(null);

      // Refresh the page to update all components
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Still refresh even if there's an error
      window.location.href = '/';
    }
  };

  return (
    <header className="relative z-50">
      {/* Top Bar */}
      <div className="hidden sm:flex bg-[#093B77] h-14 items-center justify-between px-4 sm:px-8 md:px-16">
        {/* Left Side: Phone and Email */}
        <div className="flex items-center gap-4 sm:gap-8 md:gap-16">
          <div className="flex items-center gap-0.5">
            <div className="w-6 h-6 flex items-center justify-center">
              <Image src="/icons/phone_in_talk-1.svg" alt="Phone" width={18} height={18} />
            </div>
            <Link href="tel:+201031416900" className="text-white text-xs sm:text-sm md:text-base font-normal font-poppins hover:text-orange-300 transition-colors">
              Phone: +2010 31 41 6 900
            </Link>
          </div>
          <div className="hidden sm:flex items-center gap-0.5">
            <div className="w-6 h-6 flex items-center justify-center">
              <Image src="/icons/mail.svg" alt="Email" width={18} height={18} />
            </div>
            <Link href="mailto:info@marakbi.tours" className="text-white text-xs sm:text-sm md:text-base font-normal font-poppins hover:text-orange-300 transition-colors">
              Email: info@marakbi.tours
            </Link>
          </div>
        </div>
        {/* Right Side: List your Boat and Social Icons */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href="/partner-with-us" className="text-white text-xs sm:text-sm md:text-base font-normal font-poppins hover:text-orange-300 transition-colors">
            List your Boat
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
            {/* Facebook */}
            <Link href="https://www.facebook.com/profile.php?id=61578325940602" target="_blank" rel="noopener noreferrer" className="w-6 h-6 relative overflow-hidden hover:opacity-80 transition-opacity">
              <Image src="/icons/Facebook.svg" alt="Facebook" width={24} height={24} className="w-full h-full" />
            </Link>
            {/* LinkedIn */}
            <Link href="https://www.linkedin.com/company/marakbi" target="_blank" rel="noopener noreferrer" className="w-6 h-6 relative overflow-hidden hover:opacity-80 transition-opacity">
              <Image src="/icons/Linkedin.svg" alt="LinkedIn" width={24} height={24} className="w-full h-full" />
            </Link>
            {/* Instagram */}
            <Link href="https://www.instagram.com/marakbi_app/" target="_blank" rel="noopener noreferrer" className="w-6 h-6 relative overflow-hidden hover:opacity-80 transition-opacity">
              <Image src="/icons/instgram.svg" alt="Instagram" width={24} height={24} className="w-full h-full" />
            </Link>
            {/* YouTube */}
            <Link href="https://www.youtube.com/@marakbi" target="_blank" rel="noopener noreferrer" className="w-6 h-6 relative overflow-hidden hover:opacity-80 transition-opacity">
              <Image src="/icons/youtube.svg" alt="YouTube" width={24} height={24} className="w-full h-full" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`absolute top-0 sm:top-14 left-0 right-0 z-50 ${variant === 'solid' ? 'bg-white shadow-sm' : 'bg-[#093B77] sm:bg-transparent'}`}>
        <div className="px-4 sm:px-8 md:px-16 py-4 flex justify-between items-center">
          {/* Left: Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="block sm:hidden">
              <Logo variant="white" width={48} height={60} />
            </Link>
            <Link href="/" className="hidden sm:block">
              <Logo width={64} height={80} variant={logoVariant} />
            </Link>
          </div>

          {/* Middle: Navigation Links - Desktop */}
          <div className="hidden md:flex gap-8">
            <Link href="/" className={`${textColor} text-base font-normal font-poppins ${hoverColor} transition-colors`}>Home</Link>
            <Link href="/our-team" className={`${textColor} text-base font-normal font-poppins ${hoverColor} transition-colors`}>Our Team</Link>
            {/* Our Services Dropdown */}
            <ServicesDropdown variant={variant} />
            <Link href="/boat-market" className={`${textColor} text-base font-normal font-poppins ${hoverColor} transition-colors`}>Boat Market</Link>
            <Link href="/contact" className={`${textColor} text-base font-normal font-poppins ${hoverColor} transition-colors`}>Contact</Link>
            {user && (
              <Link href="/my-bookings" className={`${textColor} text-base font-normal font-poppins ${hoverColor} transition-colors`}>My Bookings</Link>
            )}
            {/* Search Icon + Expanding Input (Desktop) */}
            <div className="relative flex items-center">
              <button
                aria-label="Open search"
                onClick={() => {
                  setIsSearchOpen((v) => !v);
                  setTimeout(() => searchInputRef.current?.focus(), 0);
                }}
                className="w-6 h-6 flex items-center justify-center"
              >
                <svg className={`w-5 h-5 ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (searchQuery.trim()) {
                      // If there's a suggestion, go to it, otherwise search with query
                      const target = filteredSuggestions[0];
                      if (target) {
                        router.push(target.href);
                      } else {
                        // Search with query parameter
                        router.push(`/boat-listing?search=${encodeURIComponent(searchQuery.trim())}`);
                      }
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }
                  } else if (e.key === 'Escape') {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }
                }}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 120)}
                placeholder="Search..."
                className={`absolute left-full ml-2 h-9 rounded-full bg-white text-gray-900 placeholder-gray-400 shadow border border-gray-200 px-4 transition-all duration-300 ease-out ${isSearchOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'
                  }`}
              />
              {/* Suggestions Dropdown */}
              {isSearchOpen && searchQuery.trim() && (
                <div className={`absolute left-full top-full ml-2 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-black/5 overflow-hidden transition-opacity duration-200 z-50 max-h-80 overflow-y-auto ${isSearchOpen ? 'opacity-100' : 'opacity-0'}`}>
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((s, idx) => (
                      <Link
                        key={`${s.href}-${idx}-${s.type}`}
                        href={s.href}
                        className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        onMouseDown={(e) => {
                          // prevent input blur from cancelling navigation before push
                          e.preventDefault();
                          router.push(s.href);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${s.type === 'category' ? 'bg-blue-100 text-blue-700' :
                            s.type === 'city' ? 'bg-green-100 text-green-700' :
                              s.type === 'boat' ? 'bg-purple-100 text-purple-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {s.type === 'category' ? 'Category' : s.type === 'city' ? 'City' : 'Boat'}
                          </span>
                          <span>{s.label}</span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No results found. Press Enter to search for &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Auth Links or Profile */}
          <div className="flex items-center gap-6">
            {user ? (
              <div className="hidden md:flex items-center gap-6">
                <Link href="/profile" className={`${textColor} text-base font-normal font-poppins ${hoverColor} transition-colors`}>
                  My Profile
                </Link>
                {/* {currentPage !== 'dashboard' && (
                  <Link href="/dashboard" className={`${textColor} text-base font-normal font-poppins ${hoverColor} transition-colors`}>
                    Dashboard
                  </Link>
                )} */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${isLoggingOut
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                    }`}
                >
                  {isLoggingOut && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-6">
                <Link href="/signup" className={`px-4 py-2 border border-orange-300 text-orange-300 text-base font-normal font-poppins rounded hover:bg-orange-300 hover:text-white transition-colors`}>
                  Register
                </Link>
                <Link href="/login" className={`${textColor} text-base font-normal font-poppins ${hoverColor} transition-colors`}>
                  Login
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-x-0 top-16 bottom-0 z-[60] md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 animate-fade-in">
            <div className="px-6 py-6 space-y-3 h-full overflow-y-auto">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg text-gray-800 text-base font-medium font-poppins hover:bg-blue-50 hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/our-team" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg text-gray-800 text-base font-medium font-poppins hover:bg-blue-50 hover:text-blue-600 transition-colors">Our Team</Link>
              <span className="block px-4 py-3 text-gray-800 text-base font-medium font-poppins">Our Services</span>
              <div className="ml-3 space-y-2">
                <Link href="/services/private-boats" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-700 text-sm font-poppins hover:bg-blue-50 hover:text-blue-600 transition-colors">PRIVATE BOATS</Link>
                <Link href="/services/sharing-boats" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-700 text-sm font-poppins hover:bg-blue-50 hover:text-blue-600 transition-colors">SHARING BOATS</Link>
                <Link href="/services/travel-boats" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-700 text-sm font-poppins hover:bg-blue-50 hover:text-blue-600 transition-colors">TRAVEL BOATS</Link>
                <Link href="/services/fishing-boats" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-700 text-sm font-poppins hover:bg-blue-50 hover:text-blue-600 transition-colors">FISHING BOATS</Link>
                <Link href="/services/stayover-boats" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-700 text-sm font-poppins hover:bg-blue-50 hover:text-blue-600 transition-colors">STAYOVER BOATS</Link>
                <Link href="/services/water-activities" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-700 text-sm font-poppins hover:bg-blue-50 hover:text-blue-600 transition-colors">WATER ACTIVITIES</Link>
                <Link href="/services/occasions" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-700 text-sm font-poppins hover:bg-blue-50 hover:text-blue-600 transition-colors">OCCASIONS</Link>
              </div>
              <Link href="/boat-market" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg text-gray-800 text-base font-medium font-poppins hover:bg-blue-50 hover:text-blue-600 transition-colors">Boat Market</Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg text-gray-800 text-base font-medium font-poppins hover:bg-blue-50 hover:text-blue-600 transition-colors">Contact</Link>
              {user && (
                <Link href="/my-bookings" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg text-gray-800 text-base font-medium font-poppins hover:bg-blue-50 hover:text-blue-600 transition-colors">My Trips</Link>
              )}

              {/* Mobile Auth Links */}
              {user ? (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg text-gray-800 text-base font-medium font-poppins hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    My Profile
                  </Link>
                  {/* {currentPage !== 'dashboard' && (
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg text-gray-800 text-base font-medium font-poppins hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      Dashboard
                    </Link>
                  )} */}
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`w-full px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${isLoggingOut
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                      }`}
                  >
                    {isLoggingOut && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white text-base font-medium font-poppins hover:bg-blue-700 transition-colors text-center block">
                    Login
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="w-full px-6 py-3 rounded-lg border-2 border-orange-300 text-orange-300 text-base font-medium font-poppins hover:bg-orange-300 hover:text-white transition-colors text-center block">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
