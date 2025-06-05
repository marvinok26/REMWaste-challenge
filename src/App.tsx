import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, MapPin, Clock, Weight, Truck, Zap, Home, Building } from 'lucide-react';

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
  const [hoveredSkip, setHoveredSkip] = useState<number | null>(null);
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
    if (size <= 8) return 'residential';
    if (size <= 16) return 'commercial';
    return 'industrial';
  };

  const getSkipCategoryName = (category: string) => {
    switch(category) {
      case 'residential': return 'Residential';
      case 'commercial': return 'Commercial';
      case 'industrial': return 'Industrial';
      default: return 'All';
    }
  };

  const getSkipImage = (category: string) => {
    switch(category) {
      case 'residential': return '/bin1.png';
      case 'commercial': return '/bin2.png';
      case 'industrial': return '/bin3.png';
      default: return '/bin1.png';
    }
  };

  const filteredSkips = filterCategory === 'all' 
    ? skips 
    : skips.filter(skip => getSkipCategory(skip.size) === filterCategory);

  const selectedSkipData = skips.find(s => s.id === selectedSkip);

  const SkipContainer = ({ skip }: { skip: Skip }) => {
    const isSelected = selectedSkip === skip.id;
    const isHovered = hoveredSkip === skip.id;
    const category = getSkipCategory(skip.size);
    
    return (
      <div
        className={`relative group cursor-pointer transition-all duration-500 ease-in-out transform
          ${isSelected ? 'scale-105 z-10' : 'hover:scale-102'}
          ${isHovered ? 'z-20' : ''}
        `}
        onClick={() => setSelectedSkip(skip.id)}
        onMouseEnter={() => setHoveredSkip(skip.id)}
        onMouseLeave={() => setHoveredSkip(null)}
      >
        {/* Floating animated background */}
        <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
          isSelected 
            ? 'bg-gradient-to-br from-blue-400 to-purple-600 opacity-20 scale-110' 
            : isHovered 
            ? 'bg-gradient-to-br from-gray-200 to-gray-300 opacity-50 scale-105'
            : 'bg-white opacity-0'
        }`} />
        
        {/* Main card */}
        <div className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 overflow-hidden ${
          isSelected 
            ? 'border-blue-500 shadow-2xl shadow-blue-200' 
            : isHovered
            ? 'border-purple-300 shadow-xl'
            : 'border-gray-200 shadow-md hover:shadow-lg'
        }`}>
          
          {/* Header with animated skip visual */}
          <div className={`relative h-40 overflow-hidden ${
            category === 'residential' ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
            category === 'commercial' ? 'bg-gradient-to-br from-blue-400 to-cyan-500' :
            'bg-gradient-to-br from-purple-400 to-pink-500'
          }`}>
            
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className={`w-full h-full bg-gradient-to-r from-transparent via-white to-transparent
                ${isHovered ? 'animate-pulse' : ''}
              `} />
            </div>
            
            {/* Skip size indicator with bounce animation */}
            <div className={`absolute top-2 sm:top-4 left-2 sm:left-4 transition-all duration-300 ${
              isSelected || isHovered ? 'animate-bounce' : ''
            }`}>
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 sm:px-4 py-1 sm:py-2">
                <span className="text-lg sm:text-2xl font-bold text-gray-800">{skip.size}</span>
                <span className="text-xs sm:text-sm font-medium text-gray-600 ml-1">YD³</span>
              </div>
            </div>
            
            {/* Category badge */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <div className="bg-black bg-opacity-20 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
                <span className="text-white text-xs font-medium">
                  {getSkipCategoryName(category)}
                </span>
              </div>
            </div>
            
            {/* Skip image */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4">
              <div className={`transition-all duration-500 ${
                isHovered ? 'scale-110 -rotate-3' : 'scale-100'
              }`}>
                <img 
                  src={getSkipImage(category)} 
                  alt={`${getSkipCategoryName(category)} Skip`}
                  className="w-30 h-20 mb-5object-contain drop-shadow-lg"
                />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 sm:p-6 pt-6 sm:pt-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {skip.size} Yard Skip
              </h3>
              {isSelected && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center animate-scale-in">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              )}
            </div>
            
            {/* Animated price */}
            <div className="mb-3 sm:mb-4">
              <div className={`transition-all duration-300 ${isSelected ? 'scale-110' : ''}`}>
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  £{calculateFinalPrice(skip.price_before_vat, skip.vat)}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 ml-2">inc. VAT</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                £{(skip.price_before_vat / 100).toFixed(2)} + VAT
              </div>
            </div>
            
            {/* Features with icons */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-center text-xs sm:text-sm">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 sm:mr-3">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">{skip.hire_period_days} days hire period</span>
              </div>
              
              <div className="flex items-center text-xs sm:text-sm">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 ${
                  skip.allowed_on_road ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Truck className={`w-3 h-3 sm:w-4 sm:h-4 ${skip.allowed_on_road ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <span className={`font-medium ${skip.allowed_on_road ? 'text-green-700' : 'text-red-700'}`}>
                  {skip.allowed_on_road ? 'Road placement allowed' : 'Private property only'}
                </span>
              </div>
              
              <div className="flex items-center text-xs sm:text-sm">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 ${
                  skip.allows_heavy_waste ? 'bg-orange-100' : 'bg-gray-100'
                }`}>
                  <Weight className={`w-3 h-3 sm:w-4 sm:h-4 ${skip.allows_heavy_waste ? 'text-orange-600' : 'text-gray-600'}`} />
                </div>
                <span className={`font-medium ${skip.allows_heavy_waste ? 'text-orange-700' : 'text-gray-700'}`}>
                  {skip.allows_heavy_waste ? 'Heavy waste accepted' : 'Light waste only'}
                </span>
              </div>
            </div>
            
            {/* Select button */}
            <button
              className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:shadow-md'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSkip(skip.id);
              }}
            >
              {isSelected ? (
                <span className="flex items-center justify-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Selected
                </span>
              ) : (
                'Select This Skip'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white border-opacity-30 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-4 h-4 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-white text-xl font-semibold mt-4 animate-pulse">Loading Skip Options...</h2>
          <p className="text-white text-opacity-70 mt-2">Finding the perfect sizes for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Floating header */}
      <div className="sticky top-0 z-30 bg-white bg-opacity-90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Skip Selection</h1>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span>NR32 - Lowestoft</span>
                </div>
              </div>
            </div>
            
            {selectedSkipData && (
              <div className="hidden lg:flex items-center space-x-4 bg-blue-50 rounded-xl px-3 sm:px-4 py-2">
                <div className="text-xs sm:text-sm">
                  <span className="text-gray-600">Selected:</span>
                  <span className="font-semibold text-blue-600 ml-1">
                    {selectedSkipData.size} Yard - £{calculateFinalPrice(selectedSkipData.price_before_vat, selectedSkipData.vat)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero section */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Choose Your Perfect Skip
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Select from our range of professional waste disposal solutions, 
            designed to meet every project need from home renovations to commercial developments.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center mb-6 sm:mb-8 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-1 sm:p-2 flex flex-wrap sm:flex-nowrap gap-1 sm:gap-2 w-full sm:w-auto overflow-x-auto">
            {['all', 'residential', 'commercial', 'industrial'].map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm whitespace-nowrap flex-1 sm:flex-none ${
                  filterCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                {category === 'all' && <Zap className="w-3 h-3 sm:w-4 sm:h-4" />}
                {category === 'residential' && <Home className="w-3 h-3 sm:w-4 sm:h-4" />}
                {category === 'commercial' && <Building className="w-3 h-3 sm:w-4 sm:h-4" />}
                {category === 'industrial' && <Truck className="w-3 h-3 sm:w-4 sm:h-4" />}
                <span className="capitalize hidden sm:inline">{getSkipCategoryName(category)}</span>
                <span className="capitalize sm:hidden">
                  {category === 'all' ? 'All' : category === 'residential' ? 'Home' : category === 'commercial' ? 'Biz' : 'Ind'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Skip grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 px-4 sm:px-0">
          {filteredSkips.map((skip) => (
            <SkipContainer key={skip.id} skip={skip} />
          ))}
        </div>

        {/* Bottom navigation */}
        <div className="sticky bottom-0 sm:bottom-4 z-20 px-4 sm:px-0">
          <div className="bg-white rounded-none sm:rounded-2xl shadow-2xl border-t sm:border border-gray-200 p-4 sm:p-6 mx-auto max-w-4xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
              <button className="flex items-center px-4 sm:px-6 py-2 sm:py-3 text-gray-600 hover:text-gray-800 transition-colors rounded-xl hover:bg-gray-100 text-sm sm:text-base order-2 sm:order-1">
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="font-medium">Back to Waste Type</span>
              </button>

              <div className="hidden lg:block order-1 sm:order-2">
                {selectedSkipData ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Ready to continue with</p>
                    <p className="font-semibold text-gray-900">
                      {selectedSkipData.size} Yard Skip - £{calculateFinalPrice(selectedSkipData.price_before_vat, selectedSkipData.vat)}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">Please select a skip size to continue</p>
                )}
              </div>

              {/* Mobile selected skip display */}
              {selectedSkipData && (
                <div className="lg:hidden w-full order-1 sm:order-2 text-center bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Selected:</p>
                  <p className="font-semibold text-blue-600 text-sm">
                    {selectedSkipData.size} Yard Skip - £{calculateFinalPrice(selectedSkipData.price_before_vat, selectedSkipData.vat)}
                  </p>
                </div>
              )}

              <button
                className={`flex items-center px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base order-3 w-full sm:w-auto justify-center ${
                  selectedSkip
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!selectedSkip}
              >
                <span className="font-medium">Continue to Permit Check</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            scale: 0;
          }
          to {
            scale: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default SkipSelector;