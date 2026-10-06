import { Trip, Member } from '../types';

export interface ExpenseSummary {
  totalEstimated: number;
  totalBudget: number;
  remainingBudget: number;
  perPersonShareUSD: number;
  perPersonShareTRIP: number; // 1 TRIP token = $2.50 USD
  categoryBreakdown: Record<string, number>;
  dailyBreakdown: Array<{ dayNumber: number; date: string; amount: number }>;
}

export function calculateTripExpenses(trip: Trip, memberCount = 3): ExpenseSummary {
  let totalEstimated = 0;
  const categoryBreakdown: Record<string, number> = {
    Sightseeing: 0,
    Food: 0,
    Culture: 0,
    Transport: 0,
    Nightlife: 0,
    Outdoor: 0,
    Shopping: 0,
    Activity: 0
  };

  const dailyBreakdown = trip.days.map(day => {
    let daySum = 0;
    day.activities.forEach(act => {
      const cost = act.estimatedCost || 0;
      daySum += cost;
      totalEstimated += cost;
      if (categoryBreakdown[act.category] !== undefined) {
        categoryBreakdown[act.category] += cost;
      } else {
        categoryBreakdown[act.category] = cost;
      }
    });
    return {
      dayNumber: day.dayNumber,
      date: day.date,
      amount: daySum
    };
  });

  const validMembers = Math.max(1, memberCount);
  const perPersonShareUSD = Math.round((totalEstimated / validMembers) * 100) / 100;
  // Let 1 TRIP test token = $2.50
  const perPersonShareTRIP = Math.round((perPersonShareUSD / 2.5) * 10) / 10;

  return {
    totalEstimated,
    totalBudget: trip.totalBudget,
    remainingBudget: trip.totalBudget - totalEstimated,
    perPersonShareUSD,
    perPersonShareTRIP,
    categoryBreakdown,
    dailyBreakdown
  };
}

export function simulatePayShareToken(
  payer: Member,
  amountTRIP: number
): { success: boolean; newBalance: number; txHash: string } {
  if (payer.testTokenBalance < amountTRIP) {
    return {
      success: false,
      newBalance: payer.testTokenBalance,
      txHash: ''
    };
  }

  const chars = '0123456789abcdef';
  let txHash = '0x';
  for (let i = 0; i < 64; i++) {
    txHash += chars[Math.floor(Math.random() * chars.length)];
  }

  return {
    success: true,
    newBalance: Math.round((payer.testTokenBalance - amountTRIP) * 100) / 100,
    txHash
  };
}
