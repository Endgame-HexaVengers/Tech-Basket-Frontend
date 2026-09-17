import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const PLAN_PRICE_IDS = {
    starter_monthly: 'price_1UGbjZ0nyT4Qws2DMtU3GRM4',
    starter_yearly: 'price_1UGbjZ0nyT4Qws2DMtU3GRM4',
    starter_yearly: 'price_1UGbjZ0nyT4Qws2DMtU3GRM4',
}
  