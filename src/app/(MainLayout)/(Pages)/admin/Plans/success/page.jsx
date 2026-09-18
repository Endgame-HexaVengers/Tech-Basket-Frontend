import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CheckCircle2, Mail, ShieldCheck, Sparkles } from 'lucide-react';

import { getStripe } from '@/lib/stripe';

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  const stripe = getStripe();
  const {
    status,
    customer_details: { email: customerEmail },
    amount_total: amountTotal,
    currency,
    id: sessionId,
    payment_status: paymentStatus,
    line_items: { data: lineItems },
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {
    const lineItem = lineItems?.[0]
    const productName = lineItem?.description || 'TechBasket subscription'
    const amount = new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: currency || 'bdt',
    }).format((amountTotal || 0) / 100)

    return (
      <section className="min-h-[calc(100vh-92px)] bg-[#07182d] px-4 py-8 text-slate-100">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.45)]">
            <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            <span className="text-sm font-semibold tracking-wide text-slate-100">Success</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-700/80 bg-[#081c31] shadow-[0_20px_60px_rgba(2,6,23,0.65)]">
            <div className="border-b border-slate-700/80 bg-slate-900/30 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/30">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-300/80">
                    Payment confirmed
                  </p>
                  <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
                    Your plan is active
                  </h1>
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-5 rounded-2xl border border-slate-700/80 bg-slate-950/30 p-5">
                <div className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                  <Mail className="mt-0.5 h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      Receipt sent to
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-100">{customerEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-violet-400" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      Your access
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-100">
                      We appreciate your business. Your account has been upgraded and is ready to use.
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-7 text-slate-300">
                  A confirmation email has been sent to your inbox. If you have any questions, please contact{' '}
                  <a href="mailto:orders@example.com" className="font-medium text-sky-300 transition hover:text-sky-200">
                    orders@example.com
                  </a>.
                </p>
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-slate-900/60 to-violet-500/10 p-5">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Ready
                  </div>
                  <h2 className="text-2xl font-bold text-white">Everything is set</h2>
                </div>

                <div className="mt-6 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-xl border border-slate-700/80 bg-slate-950/30 px-3 py-2">
                    <span>Status</span>
                    <span className="font-semibold text-emerald-300">Complete</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-700/80 bg-slate-950/30 px-3 py-2">
                    <span>Plan</span>
                    <span className="font-semibold text-slate-100">Premium</span>
                  </div>
                </div>

                <Link
                  href="/"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110"
                >
                  Back to dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}