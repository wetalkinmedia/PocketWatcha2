export const cityGroups = [
  {
    label: "🇺🇸 United States - High Cost",
    cities: [
      { value: "new-york", name: "New York City, NY", multiplier: 1.4, country: "US", flag: "🇺🇸" },
      { value: "san-francisco", name: "San Francisco, CA", multiplier: 1.5, country: "US", flag: "🇺🇸" },
      { value: "los-angeles", name: "Los Angeles, CA", multiplier: 1.3, country: "US", flag: "🇺🇸" },
      { value: "seattle", name: "Seattle, WA", multiplier: 1.25, country: "US", flag: "🇺🇸" },
      { value: "boston", name: "Boston, MA", multiplier: 1.3, country: "US", flag: "🇺🇸" },
      { value: "washington-dc", name: "Washington, DC", multiplier: 1.35, country: "US", flag: "🇺🇸" }
    ]
  },
  {
    label: "🇺🇸 United States - Medium Cost",
    cities: [
      { value: "chicago", name: "Chicago, IL", multiplier: 1.1, country: "US", flag: "🇺🇸" },
      { value: "denver", name: "Denver, CO", multiplier: 1.15, country: "US", flag: "🇺🇸" },
      { value: "austin", name: "Austin, TX", multiplier: 1.2, country: "US", flag: "🇺🇸" },
      { value: "atlanta", name: "Atlanta, GA", multiplier: 1.05, country: "US", flag: "🇺🇸" },
      { value: "philadelphia", name: "Philadelphia, PA", multiplier: 1.1, country: "US", flag: "🇺🇸" },
      { value: "miami", name: "Miami, FL", multiplier: 1.15, country: "US", flag: "🇺🇸" }
    ]
  },
  {
    label: "🇺🇸 United States - Low Cost",
    cities: [
      { value: "kansas-city", name: "Kansas City, MO", multiplier: 0.8, country: "US", flag: "🇺🇸" },
      { value: "indianapolis", name: "Indianapolis, IN", multiplier: 0.75, country: "US", flag: "🇺🇸" },
      { value: "cleveland", name: "Cleveland, OH", multiplier: 0.7, country: "US", flag: "🇺🇸" },
      { value: "birmingham", name: "Birmingham, AL", multiplier: 0.65, country: "US", flag: "🇺🇸" },
      { value: "buffalo", name: "Buffalo, NY", multiplier: 0.7, country: "US", flag: "🇺🇸" },
      { value: "memphis", name: "Memphis, TN", multiplier: 0.7, country: "US", flag: "🇺🇸" }
    ]
  },
  {
    label: "🇬🇧 United Kingdom",
    cities: [
      { value: "london", name: "London", multiplier: 1.4, country: "UK", flag: "🇬🇧" },
      { value: "manchester", name: "Manchester", multiplier: 1.0, country: "UK", flag: "🇬🇧" },
      { value: "edinburgh", name: "Edinburgh", multiplier: 1.1, country: "UK", flag: "🇬🇧" },
      { value: "birmingham-uk", name: "Birmingham", multiplier: 0.9, country: "UK", flag: "🇬🇧" }
    ]
  },
  {
    label: "🇨🇦 Canada",
    cities: [
      { value: "toronto", name: "Toronto", multiplier: 1.2, country: "Canada", flag: "🇨🇦" },
      { value: "vancouver", name: "Vancouver", multiplier: 1.3, country: "Canada", flag: "🇨🇦" },
      { value: "montreal", name: "Montreal", multiplier: 1.0, country: "Canada", flag: "🇨🇦" },
      { value: "calgary", name: "Calgary", multiplier: 1.05, country: "Canada", flag: "🇨🇦" }
    ]
  },
  {
    label: "🇦🇺 Australia",
    cities: [
      { value: "sydney", name: "Sydney", multiplier: 1.35, country: "Australia", flag: "🇦🇺" },
      { value: "melbourne", name: "Melbourne", multiplier: 1.25, country: "Australia", flag: "🇦🇺" },
      { value: "brisbane", name: "Brisbane", multiplier: 1.1, country: "Australia", flag: "🇦🇺" },
      { value: "perth", name: "Perth", multiplier: 1.15, country: "Australia", flag: "🇦🇺" }
    ]
  },
  {
    label: "🇪🇺 Europe",
    cities: [
      { value: "paris", name: "Paris, France", multiplier: 1.3, country: "France", flag: "🇫🇷" },
      { value: "berlin", name: "Berlin, Germany", multiplier: 1.0, country: "Germany", flag: "🇩🇪" },
      { value: "amsterdam", name: "Amsterdam, Netherlands", multiplier: 1.25, country: "Netherlands", flag: "🇳🇱" },
      { value: "zurich", name: "Zurich, Switzerland", multiplier: 1.6, country: "Switzerland", flag: "🇨🇭" },
      { value: "stockholm", name: "Stockholm, Sweden", multiplier: 1.2, country: "Sweden", flag: "🇸🇪" },
      { value: "madrid", name: "Madrid, Spain", multiplier: 0.95, country: "Spain", flag: "🇪🇸" },
      { value: "rome", name: "Rome, Italy", multiplier: 1.0, country: "Italy", flag: "🇮🇹" }
    ]
  },
  {
    label: "🌍 Africa",
    cities: [
      { value: "cape-town", name: "Cape Town, South Africa", multiplier: 0.6, country: "South Africa", flag: "🇿🇦" },
      { value: "johannesburg", name: "Johannesburg, South Africa", multiplier: 0.55, country: "South Africa", flag: "🇿🇦" },
      { value: "lagos", name: "Lagos, Nigeria", multiplier: 0.4, country: "Nigeria", flag: "🇳🇬" },
      { value: "nairobi", name: "Nairobi, Kenya", multiplier: 0.5, country: "Kenya", flag: "🇰🇪" },
      { value: "cairo", name: "Cairo, Egypt", multiplier: 0.3, country: "Egypt", flag: "🇪🇬" },
      { value: "casablanca", name: "Casablanca, Morocco", multiplier: 0.45, country: "Morocco", flag: "🇲🇦" },
      { value: "accra", name: "Accra, Ghana", multiplier: 0.4, country: "Ghana", flag: "🇬🇭" },
      { value: "addis-ababa", name: "Addis Ababa, Ethiopia", multiplier: 0.25, country: "Ethiopia", flag: "🇪🇹" },
      { value: "kampala", name: "Kampala, Uganda", multiplier: 0.3, country: "Uganda", flag: "🇺🇬" },
      { value: "dar-es-salaam", name: "Dar es Salaam, Tanzania", multiplier: 0.35, country: "Tanzania", flag: "🇹🇿" },
      { value: "kigali", name: "Kigali, Rwanda", multiplier: 0.4, country: "Rwanda", flag: "🇷🇼" },
      { value: "tunis", name: "Tunis, Tunisia", multiplier: 0.35, country: "Tunisia", flag: "🇹🇳" },
      { value: "algiers", name: "Algiers, Algeria", multiplier: 0.3, country: "Algeria", flag: "🇩🇿" },
      { value: "abidjan", name: "Abidjan, Côte d'Ivoire", multiplier: 0.4, country: "Côte d'Ivoire", flag: "🇨🇮" },
      { value: "dakar", name: "Dakar, Senegal", multiplier: 0.35, country: "Senegal", flag: "🇸🇳" }
    ]
  },
  {
    label: "🌏 Asia",
    cities: [
      { value: "tokyo", name: "Tokyo, Japan", multiplier: 1.3, country: "Japan", flag: "🇯🇵" },
      { value: "singapore", name: "Singapore", multiplier: 1.2, country: "Singapore", flag: "🇸🇬" },
      { value: "hong-kong", name: "Hong Kong", multiplier: 1.4, country: "Hong Kong", flag: "🇭🇰" },
      { value: "shanghai", name: "Shanghai, China", multiplier: 0.9, country: "China", flag: "🇨🇳" },
      { value: "mumbai", name: "Mumbai, India", multiplier: 0.4, country: "India", flag: "🇮🇳" },
      { value: "bangalore", name: "Bangalore, India", multiplier: 0.45, country: "India", flag: "🇮🇳" },
      { value: "delhi", name: "Delhi, India", multiplier: 0.5, country: "India", flag: "🇮🇳" },
      { value: "seoul", name: "Seoul, South Korea", multiplier: 1.2, country: "South Korea", flag: "🇰🇷" },
      { value: "bangkok", name: "Bangkok, Thailand", multiplier: 0.6, country: "Thailand", flag: "🇹🇭" },
      { value: "kuala-lumpur", name: "Kuala Lumpur, Malaysia", multiplier: 0.7, country: "Malaysia", flag: "🇲🇾" },
      { value: "jakarta", name: "Jakarta, Indonesia", multiplier: 0.5, country: "Indonesia", flag: "🇮🇩" },
      { value: "manila", name: "Manila, Philippines", multiplier: 0.6, country: "Philippines", flag: "🇵🇭" },
      { value: "dubai", name: "Dubai, UAE", multiplier: 1.3, country: "UAE", flag: "🇦🇪" },
      { value: "tel-aviv", name: "Tel Aviv, Israel", multiplier: 1.35, country: "Israel", flag: "🇮🇱" }
    ]
  },
  {
    label: "🌎 Americas",
    cities: [
      { value: "sao-paulo", name: "São Paulo, Brazil", multiplier: 0.6, country: "Brazil", flag: "🇧🇷" },
      { value: "mexico-city", name: "Mexico City, Mexico", multiplier: 0.5, country: "Mexico", flag: "🇲🇽" },
      { value: "buenos-aires", name: "Buenos Aires, Argentina", multiplier: 0.4, country: "Argentina", flag: "🇦🇷" },
      { value: "santiago", name: "Santiago, Chile", multiplier: 0.7, country: "Chile", flag: "🇨🇱" },
      { value: "lima", name: "Lima, Peru", multiplier: 0.45, country: "Peru", flag: "🇵🇪" },
      { value: "bogota", name: "Bogotá, Colombia", multiplier: 0.4, country: "Colombia", flag: "🇨🇴" },
      { value: "caracas", name: "Caracas, Venezuela", multiplier: 0.3, country: "Venezuela", flag: "🇻🇪" },
      { value: "montevideo", name: "Montevideo, Uruguay", multiplier: 0.55, country: "Uruguay", flag: "🇺🇾" }
    ]
  },
  {
    label: "Other",
    cities: [
      { value: "other", name: "Other Location", multiplier: 1.0, country: "Other", flag: "🌍" }
    ]
  }
];

export function getCityMultiplier(cityValue: string): number {
  for (const group of cityGroups) {
    const city = group.cities.find(c => c.value === cityValue);
    if (city) return city.multiplier;
  }
  return 1.0;
}

export function getCityData(cityValue: string) {
  for (const group of cityGroups) {
    const city = group.cities.find(c => c.value === cityValue);
    if (city) return city;
  }
  return null;
}