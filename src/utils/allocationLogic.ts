import { Allocations, AgeGroup, LivingSituation } from '../types';
import { getCityMultiplier } from './cityData';

export function getPersonalizedAllocation(age: AgeGroup, demographic: LivingSituation, city?: string): Allocations {
  const cityMultiplier = city ? getCityMultiplier(city) : 1.0;
  
  console.log('Allocation inputs:', { age, demographic, city, cityMultiplier });
  
  let base: Allocations = {
    necessities: { percentage: 50, name: "Essential Expenses", emoji: "🏠" },
    savings: { percentage: 20, name: "Emergency Fund & Savings", emoji: "🛡️" },
    investments: { percentage: 15, name: "Investments & Future", emoji: "📈" },
    entertainment: { percentage: 10, name: "Fun & Entertainment", emoji: "🎉" },
    personal: { percentage: 5, name: "Personal Development", emoji: "📚" }
  };

  // City-based adjustments (high cost cities need more for necessities)
  if (cityMultiplier > 1.3) {
    // Very expensive cities
    base.necessities.percentage += 10;
    base.investments.percentage = Math.max(5, base.investments.percentage - 5);
    base.entertainment.percentage = Math.max(3, base.entertainment.percentage - 3);
    base.personal.percentage = Math.max(2, base.personal.percentage - 2);
  } else if (cityMultiplier > 1.1) {
    // Moderately expensive cities
    base.necessities.percentage += 5;
    base.investments.percentage = Math.max(5, base.investments.percentage - 3);
    base.entertainment.percentage = Math.max(5, base.entertainment.percentage - 2);
  } else if (cityMultiplier < 0.8) {
    // Very affordable cities
    base.necessities.percentage = Math.max(35, base.necessities.percentage - 10);
    base.investments.percentage += 7;
    base.savings.percentage += 3;
  } else if (cityMultiplier < 0.9) {
    // Affordable cities
    base.necessities.percentage = Math.max(40, base.necessities.percentage - 5);
    base.investments.percentage += 3;
    base.savings.percentage += 2;
  }

  // Age-based adjustments
  switch (age) {
    case "18-25":
      base.investments.percentage = Math.max(5, base.investments.percentage - 5);
      base.entertainment.percentage = 15;
      base.personal.percentage = 10;
      break;
    case "26-35":
      base.investments.percentage += 5;
      base.savings.percentage = Math.max(10, base.savings.percentage - 5);
      base.entertainment.percentage = Math.max(8, base.entertainment.percentage);
      break;
    case "36-45":
      base.investments.percentage += 10;
      base.savings.percentage = Math.max(10, base.savings.percentage - 5);
      base.entertainment.percentage = Math.max(6, base.entertainment.percentage - 2);
      base.personal.percentage = Math.max(2, base.personal.percentage - 3);
      break;
    case "46-55":
      base.investments.percentage += 15;
      base.savings.percentage = Math.max(8, base.savings.percentage - 8);
      base.entertainment.percentage = Math.max(5, base.entertainment.percentage - 4);
      base.personal.percentage = Math.max(2, base.personal.percentage - 3);
      break;
    case "56+":
      base.necessities.percentage = 55;
      base.investments.percentage += 5;
      base.savings.percentage = Math.max(10, base.savings.percentage - 5);
      base.entertainment.percentage = Math.max(5, base.entertainment.percentage - 2);
      base.personal.percentage = Math.max(2, base.personal.percentage - 3);
      break;
  }

  // Demographic adjustments
  switch (demographic) {
    case "student":
      base.necessities.percentage = Math.max(40, base.necessities.percentage - 5);
      base.entertainment.percentage = 20;
      base.personal.percentage = 10;
      base.investments.percentage = Math.max(5, base.investments.percentage - 10);
      break;
    case "family":
      base.necessities.percentage = 60;
      base.entertainment.percentage = Math.max(3, base.entertainment.percentage - 5);
      base.savings.percentage = Math.max(10, base.savings.percentage - 5);
      base.investments.percentage = Math.max(10, base.investments.percentage);
      base.personal.percentage = Math.max(3, base.personal.percentage);
      break;
    case "retiree":
      base.necessities.percentage = 70;
      base.entertainment.percentage = 15;
      base.savings.percentage = Math.max(5, base.savings.percentage - 10);
      base.investments.percentage = Math.max(3, base.investments.percentage - 12);
      base.personal.percentage = Math.max(2, base.personal.percentage - 3);
      break;
  }

  // Ensure percentages add up to 100
  const total = Object.values(base).reduce((sum, item) => sum + item.percentage, 0);
  if (total !== 100) {
    const diff = 100 - total;
    base.necessities.percentage += diff; // Adjust necessities to balance
    // Ensure no negative percentages
    base.necessities.percentage = Math.max(0, base.necessities.percentage);
  }

  console.log('Final allocations:', base);
  return base;
}