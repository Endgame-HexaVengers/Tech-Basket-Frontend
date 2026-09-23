import 'server-only'

import Stripe from 'stripe'

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }

  return new Stripe(secretKey)
}

export const PRICE_IDS = {
  starter_monthly:'price_1UGbjZ0nyT4Qws2DMtU3GRM4',
  starter_sixMonths: 'price_1UGbzf0nyT4Qws2DxA8tDBqQ',
  starter_yearly: 'price_1UGcE50nyT4Qws2DDl9mzFO5',
  growth_monthly:'price_1UGbnn0nyT4Qws2DWBAQzWco',
  growth_sixMonths: 'price_1UGc0S0nyT4Qws2DTpg8DalE',
  growth_yearly: 'price_1UGefB0nyT4Qws2DDfm3iUkV',
  pro_monthly: 'price_1UGbqO0nyT4Qws2DWh5OvMrD',
  pro_sixMonths: 'price_1UGc1R0nyT4Qws2DftrXkcDz',
  pro_yearly: 'price_1UGeg10nyT4Qws2DPQZ4fSOa',
  enterprise_monthly: 'price_1UGbtK0nyT4Qws2DnMIl5nVa',
  enterprise_sixMonths: 'price_1UGc2Y0nyT4Qws2DTP6BCkHS',
  enterprise_yearly: 'price_1UGehW0nyT4Qws2DhO5awqPW',
  Agency_Reseller_monthly: 'price_1UGbuI0nyT4Qws2DJYgQN3Bh',
  Agency_Reseller_sixMonths: 'price_1UGc5G0nyT4Qws2DreKVleYg',
  Agency_Reseller_yearly: 'price_1UGeiL0nyT4Qws2DIEB0Czxi',
}

  