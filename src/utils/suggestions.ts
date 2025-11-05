import { AgeGroup, LivingSituation } from '../types';
import { getCurrencySymbol } from './currencyData';
import { getCityMultiplier } from './cityData';

type SuggestionKey = 'necessities' | 'savings' | 'investments' | 'entertainment' | 'personal';

const baseSuggestions: Record<SuggestionKey, Record<AgeGroup, string[]>> = {
  necessities: {
    "18-25": ["Get 2-3 roommates in affordable cities - rent drops significantly! 🏠", "Skip the daily expensive coffee and make it at home - your wallet will thank you! ☕"],
    "26-35": ["Meal prep like a boss instead of ordering takeout every night! 🥗", "Consider buying in emerging neighborhoods - appreciation potential! 🏡"],
    "36-45": ["Refinance that mortgage if rates dropped - every percent counts! 🏦", "Energy-efficient appliances now = lower bills forever! 💡"],
    "46-55": ["Downsize before retirement - less house, more travel fund! ✈️", "Pay off that mortgage early if you can - freedom feels amazing! 🎉"],
    "56+": ["Healthcare costs are real - budget accordingly and stay healthy! 🏥", "Consider senior discounts everywhere - you've earned them! 🎫"]
  },
  savings: {
    "18-25": ["Start that emergency fund with just $25/month - future you will be grateful! 🙏", "Automate savings so you can't spend it on impulse purchases! 🤖"],
    "26-35": ["Aim for 6 months of expenses saved - job security in uncertain times! 💪", "High-yield savings account > regular savings - make your money work! 💰"],
    "36-45": ["Beef up that emergency fund - kids and mortgages need backup plans! 👨‍👩‍👧‍👦", "Consider a money market account for better returns on your safety net! 📊"],
    "46-55": ["Max out those catch-up contributions - retirement is closer than you think! ⏰", "Consider a conservative bond ladder for steady returns! 📈"],
    "56+": ["Keep 1-2 years of expenses liquid - you never know what life throws! 🎯", "CDs and treasury bills are your friends for safe, steady growth! 🏛️"]
  },
  investments: {
    "18-25": ["Index funds > individual stocks - diversification is your superpower! 🦸‍♀️", "Start with $50/month in a Roth IRA - compound interest is magic! ✨"],
    "26-35": ["Max that 401k match - it's literally free money from your boss! 💸", "Consider target-date funds if picking stocks feels overwhelming! 🎯"],
    "36-45": ["Rebalance annually - don't let one asset class take over your portfolio! ⚖️", "529 plans for kids' education - because college is expensive! 🎓"],
    "46-55": ["Start shifting to more conservative investments - protect what you've built! 🛡️", "Consider dividend-paying stocks for steady income streams! 💰"],
    "56+": ["Focus on income-generating investments - bonds, REITs, dividend stocks! 🏢", "Don't abandon stocks entirely - inflation protection is key! 📈"]
  },
  entertainment: {
    "18-25": ["Netflix party > movie theater - same fun, way less money! 🎬", "Happy hours and potlucks > expensive dinners out! 🍻"],
    "26-35": ["Date nights at home can be just as romantic (and cheaper)! 💕", "Free community events > pricey weekend plans! 🎪"],
    "36-45": ["Family game nights > expensive theme parks every weekend! 🎲", "Staycations can be more relaxing than costly vacations! 🏖️"],
    "46-55": ["Senior discounts on entertainment - use them proudly! 🎭", "Off-season travel = same experience, half the price! ✈️"],
    "56+": ["Community center activities > expensive club memberships! 🏊‍♂️", "Matinee movies and early bird dinners - why pay full price? 🍽️"]
  },
  personal: {
    "18-25": ["YouTube University > expensive courses sometimes! 📺", "Library books > buying every book you might read! 📖"],
    "26-35": ["Professional development courses > that designer handbag! 💼", "Gym membership > personal trainer sessions to start! 💪"],
    "36-45": ["Online certifications > MBA (unless your employer pays)! 💻", "Meditation app > expensive therapy (though therapy is great too)! 🧘‍♀️"],
    "46-55": ["Health and wellness investments pay the best dividends! 🍎", "Learning new skills keeps your mind sharp and wallet happy! 🧠"],
    "56+": ["Invest in experiences and health - money can't buy time! ⏳", "Hobbies that generate income are the best hobbies! 🎨"]
  }
};

function getCitySpecificSuggestions(city: string, category: SuggestionKey, age: AgeGroup, currencySymbol: string): string[] {
  const multiplier = getCityMultiplier(city);
  
  // High cost cities
  if (multiplier > 1.3) {
    if (category === 'necessities') {
      return [
        `Living in an expensive city? Consider house-sharing to cut rent by 50%+ - from ${currencySymbol}3000 to ${currencySymbol}1500! 🏠`,
        `Skip the daily ${currencySymbol}8 coffee in expensive areas - make it at home and save ${currencySymbol}200/month! ☕`,
        `Use public transit instead of owning a car - save ${currencySymbol}800+/month on payments, insurance, and parking! 🚇`
      ];
    }
    if (category === 'savings') {
      return [
        `High cost of living means higher savings targets - aim for 8-12 months of expenses! 💪`,
        `Consider moving to suburbs for better value - same job, lower costs! 🚊`
      ];
    }
  }
  
  // Low cost cities
  if (multiplier < 0.8) {
    if (category === 'necessities') {
      return [
        `Living in an affordable area? Take advantage - buy instead of rent if possible! 🏡`,
        `Lower cost of living means more money for other goals - maximize this advantage! 💰`
      ];
    }
    if (category === 'investments') {
      return [
        `Affordable living = more investment potential - consider increasing your investment percentage! 📈`,
        `Lower expenses mean you can take slightly more investment risk for higher returns! 🚀`
      ];
    }
  }
  
  return [];
}

export function getSuggestion(category: SuggestionKey, age: AgeGroup, city?: string, currency?: string): string {
  const currencySymbol = currency ? getCurrencySymbol(currency) : '$';
  
  // Try city-specific suggestions first
  if (city) {
    const citySpecific = getCitySpecificSuggestions(city, category, age, currencySymbol);
    if (citySpecific.length > 0) {
      return citySpecific[Math.floor(Math.random() * citySpecific.length)];
    }
  }
  
  // Fall back to base suggestions with currency symbol replacement
  const categoryAdvice = baseSuggestions[category][age];
  let suggestion = categoryAdvice[Math.floor(Math.random() * categoryAdvice.length)];
  
  // Replace $ with appropriate currency symbol
  suggestion = suggestion.replace(/\$(\d+)/g, `${currencySymbol}$1`);
  
  return categoryAdvice[Math.floor(Math.random() * categoryAdvice.length)];
}