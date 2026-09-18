import { NextResponse } from 'next/server'

import { getStripe, PRICE_IDS } from '../../../lib/stripe'
import { auth } from '../../../lib/auth'


export async function POST(request) {
  try {
    const stripe = getStripe()
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured on the server.' },
        { status: 500 },
      )
    }

    const userSession = await auth.api.getSession({ headers: request.headers })
    const customerEmail = userSession?.user?.email

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'You must be logged in before starting checkout.' },
        { status: 401 },
      )
    }

    const formData = await request.formData()
    const plan = String(formData.get('plan') || '')
    const billingCycle = String(formData.get('billingCycle') || 'monthly')
    const priceKey = plan === 'custom' ? 'Agency_Reseller' : plan
    const price = PRICE_IDS[`${priceKey}_${billingCycle}`]

    if (!price) {
      return NextResponse.json(
        { error: 'This plan is not configured for checkout.' },
        { status: 400 },
      )
    }

    const origin = new URL(request.url).origin

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/admin/Plans/success?session_id={CHECKOUT_SESSION_ID}`,
      integration_identifier: 'tech_basket_checkout',
      customer_email: customerEmail,
      cancel_url: `${origin}/admin/Plans`,
    });
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}