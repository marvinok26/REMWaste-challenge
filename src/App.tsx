const getCategoryInfo = (category: string) => {
    switch(category) {
      case 'small': return { name: 'Small Projects', desc: 'Perfect for home clearouts and garden waste' };
      case 'medium': return { name: 'Medium Projects', desc: 'Ideal for renovations and office clearouts' };
      case 'large': return { name: 'Large Projects', desc: 'Best for construction and major clearouts' };
      default: return { name: 'All Sizes', desc: 'Find the perfect skip for any project' };
    }
  };import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, MapPin, Clock, Weight, Truck, Shield, Star } from 'lucide-react';

interface Skip {
  id: number;
  size: number;
  hire_period_days: number;
  price_before_vat: number;
  vat: number;
  allowed_on_road: boolean;
  allows_heavy_waste: boolean;
  forbidden: boolean;
}

const SkipSelector = () => {
  const [skips, setSkips] = useState<Skip[]>([]);
  const [selectedSkip, setSelectedSkip] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkips = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSkips(data);
      } catch (error) {
        console.error('Error fetching skip data:', error);
        setSkips([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkips();
  }, []);

  const calculateFinalPrice = (priceBeforeVat: number, vat: number) => {
    return ((priceBeforeVat * (1 + vat / 100)) / 100).toFixed(2);
  };

  const getSkipCategory = (size: number) => {
    if (size <= 8) return 'small';
    if (size <= 16) return 'medium';
    return 'large';
  };

  const getSkipImage = (category: string) => {
    switch(category) {
      case 'small': return '/images/bin1.png';
      case 'medium': return '/images/bin2.png';
      case 'large': return '/images/bin3.png';
      default: return '/bin1.png';
    }
  };

  const filteredSkips = filterCategory === 'all' 
    ? skips 
    : skips.filter(skip => getSkipCategory(skip.size) === filterCategory);

  const selectedSkipData = skips.find(s => s.id === selectedSkip);

  const SkipCard = ({ skip }: { skip: Skip }) => {
    const isSelected = selectedSkip === skip.id;
    const category = getSkipCategory(skip.size);
    
    return (
      <div
        className={`bg-white rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
          isSelected 
            ? 'border-blue-600 shadow-lg ring-2 ring-blue-100' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => setSelectedSkip(skip.id)}
      >
        {/* Header */}
        <div className="relative bg-gray-50 p-6 border-b border-gray-100">
          {/* Skip Image */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img 
                src={getSkipImage(category)} 
                alt={`${skip.size} Yard Skip`}
                className="w-20 h-16 object-contain"
                onError={(e) => {
                  // Fallback to text if image fails
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              {/* Fallback if image doesn't load */}
              <div className="w-20 h-16 bg-blue-100 rounded-lg hidden items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">{skip.size}yd³</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-center w-full">
              <h3 className="text-xl font-semibold text-gray-900">
                {skip.size} Cubic Yard Skip
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {skip.hire_period_days} day hire period
              </p>
            </div>
            {isSelected && (
              <div className="absolute top-4 right-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          
          {/* Price */}
          <div className="text-center mb-4">
            <div className="flex items-baseline justify-center">
              <span className="text-3xl font-bold text-gray-900">
                £{calculateFinalPrice(skip.price_before_vat, skip.vat)}
              </span>
              <span className="text-sm text-gray-600 ml-2">inc. VAT</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              (£{(skip.price_before_vat / 100).toFixed(2)} + VAT)
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="p-6">
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">{skip.hire_period_days} days included</span>
            </div>
            
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                skip.allowed_on_road ? 'bg-green-50' : 'bg-orange-50'
              }`}>
                <Truck className={`w-4 h-4 ${skip.allowed_on_road ? 'text-green-600' : 'text-orange-600'}`} />
              </div>
              <span className="text-sm text-gray-700">
                {skip.allowed_on_road ? 'Road placement available' : 'Private property only'}
              </span>
            </div>
            
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                skip.allows_heavy_waste ? 'bg-blue-50' : 'bg-gray-50'
              }`}>
                <Weight className={`w-4 h-4 ${skip.allows_heavy_waste ? 'text-blue-600' : 'text-gray-600'}`} />
              </div>
              <span className="text-sm text-gray-700">
                {skip.allows_heavy_waste ? 'Heavy materials accepted' : 'Light waste only'}
              </span>
            </div>
          </div>

          {/* Select Button */}
          <button
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
              isSelected
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSkip(skip.id);
            }}
          >
            {isSelected ? 'Selected' : 'Select This Skip'}
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Skip Options</h2>
          <p className="text-gray-600">Please wait while we find the best options for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WE WANT WASTE</h1>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>NR32 - Lowestoft</span>
                </div>
              </div>
            </div>
            
            {/* Trust indicators */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>4.8/5 Rating</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Licensed</span> Waste Carrier
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Skip Size
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional waste disposal services for your project. 
            All prices include delivery, collection, and proper disposal.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
            {['all', 'small', 'medium', 'large'].map((category) => {
              const info = getCategoryInfo(category);
              return (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 ${
                    filterCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {info.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Description */}
        {filterCategory !== 'all' && (
          <div className="text-center mb-8">
            <p className="text-gray-600">{getCategoryInfo(filterCategory).desc}</p>
          </div>
        )}

        {/* Skip Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredSkips.map((skip) => (
            <SkipCard key={skip.id} skip={skip} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors">
              <ChevronLeft className="w-5 h-5 mr-2" />
              <span>Back to Waste Type</span>
            </button>

            <div className="text-center">
              {selectedSkipData ? (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selected:</p>
                  <p className="font-semibold text-gray-900">
                    {selectedSkipData.size} Yard Skip - £{calculateFinalPrice(selectedSkipData.price_before_vat, selectedSkipData.vat)}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Please select a skip size to continue</p>
              )}
            </div>

            <button
              className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center ${
                selectedSkip
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!selectedSkip}
            >
              <span>Continue to Booking</span>
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <span>✓ Licensed Waste Carrier</span>
            <span>✓ Same Day Service Available</span>
            <span>✓ Environment Agency Approved</span>
            <span>✓ Full Insurance Coverage</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkipSelector;