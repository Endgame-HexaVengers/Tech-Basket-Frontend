
import { NextResponse } from "next/server";

import { PRICE_IDS, getStripe } from "../../../lib/stripe";
import { auth } from "../../../lib/auth";

export async function POST(request) {
  try {
    // Check Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          error: "Stripe is not configured on the server.",
        },
        {
          status: 500,
        }
      );
    }

    const stripe = getStripe();

    // Get logged-in user
    const userSession = await auth.api.getSession({
      headers: request.headers,
    });

    const customerEmail = userSession?.user?.email;

    if (!customerEmail) {
      return NextResponse.json(
        {
          error: "You must be logged in before starting checkout.",
        },
        {
          status: 401,
        }
      );
    }

    // Get form data
    const formData = await request.formData();

    const plan = String(formData.get("plan") || "");

    const billingCycle = String(
      formData.get("billingCycle") || "monthly"
    );

    // Custom plan uses Agency_Reseller prices
    const priceKey =
      plan === "custom"
        ? "Agency_Reseller"
        : plan;

    // Example:
    // starter + monthly
    // => starter_monthly

    const priceIdKey = `${priceKey}_${billingCycle}`;

    const price = PRICE_IDS[priceIdKey];

    if (!price) {
      return NextResponse.json(
        {
          error: "This plan is not configured for checkout.",
        },
        {
          status: 400,
        }
      );
    }

    // Current website URL
    const origin = new URL(request.url).origin;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      customer_email: customerEmail,

      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],

      success_url: `${origin}/admin/Plans/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${origin}/admin/Plans`,

      metadata: {
        plan: priceKey,
        billingCycle: billingCycle,
        userEmail: customerEmail,
      },
    });

    // Check checkout URL
    if (!session.url) {
      return NextResponse.json(
        {
          error: "Stripe did not return a checkout URL.",
        },
        {
          status: 500,
        }
      );
    }

    // Redirect user to Stripe Checkout
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error("Stripe checkout error:", err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong while creating checkout session.",
      },
      {
        status:
          err?.statusCode || 500,
      }
    );
  }
}