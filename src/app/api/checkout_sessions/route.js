import { NextResponse } from 'next/server';

import { getStripe, PRICE_IDS } from '../../../lib/stripe';
import { auth } from '../../../lib/auth';

export async function POST(request) {
  try {
    const stripe = getStripe();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          error: 'Stripe is not configured on the server.',
        },
        {
          status: 500,
        }
      );
    }

    // Get logged-in user
    const userSession = await auth.api.getSession({
      headers: request.headers,
    });

    const customerEmail = userSession?.user?.email;

    if (!customerEmail) {
      return NextResponse.json(
        {
          error:
            'You must be logged in before starting checkout.',
        },
        {
          status: 401,
        }
      );
    }

    // Get form data
    const formData = await request.formData();

    const plan = String(formData.get('plan') || '');
    const billingCycle = String(
      formData.get('billingCycle') || 'monthly'
    );

    // Custom plan uses Agency_Reseller prices
    const priceKey =
      plan === 'custom'
        ? 'Agency_Reseller'
        : plan;

    // Example:
    // starter + monthly
    // => starter_monthly
    const priceIdKey = `${priceKey}_${billingCycle}`;

    const price = PRICE_IDS[priceIdKey];

    if (!price) {
      return NextResponse.json(
        {
          error:
            'This plan is not configured for checkout.',
        },
        {
          status: 400,
        }
      );
    }

    // Current website URL
    const origin = new URL(request.url).origin;

    // Create Stripe Checkout Session
    const session =
      await stripe.checkout.sessions.create({
        line_items: [
          {
            price,
            quantity: 1,
          },
        ],

        mode: 'subscription',

        // IMPORTANT
        // Stripe automatically replaces
        // {CHECKOUT_SESSION_ID}
        // with the real checkout session ID.
        success_url:
          `${origin}/admin/Plans/success` +
          `?session_id={CHECKOUT_SESSION_ID}`,

        // If user cancels payment
        cancel_url:
          `${origin}/admin/Plans`,

        // Logged-in user's email
        customer_email: customerEmail,

        integration_identifier:
          'tech_basket_checkout',
      });

    // Make sure Stripe returned a URL
    if (!session.url) {
      return NextResponse.json(
        {
          error:
            'Stripe did not return a checkout URL.',
        },
        {
          status: 500,
        }
      );
    }

    // Redirect user to Stripe Checkout
    return NextResponse.redirect(
      session.url,
      303
    );
  } catch (err) {
    console.error(
      'Stripe checkout error:',
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Something went wrong while creating checkout session.',
      },
      {
        status:
          err?.statusCode || 500,
      }
    );
  }
}