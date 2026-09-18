import 'server-only'

import Stripe from 'stripe'

export function getStripe() {
    const secretKey = process.env.STRIPE_SECRET_KEY

    if (!secretKey) {
        throw new Error('STRIPE_SECRET_KEY is not configured')
    }

    return new Stripe(secretKey)
}

export const PLAN_PRICE_IDS = {
    starter_monthly: 'price_1UGbjZ0nyT4Qws2DMtU3GRM4',
    starter_yearly: 'price_1UGbjZ0nyT4Qws2DMtU3GRM4',
    pro_yearly: 'price_1UGbjZ0nyT4Qws2DMtU3GRM4',
}
  