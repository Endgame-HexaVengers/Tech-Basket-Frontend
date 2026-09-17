"use client"

import Link from 'next/link'

export default function PaymentReceipt({
  amount,
  customerEmail,
  paymentStatus,
  productName,
  sessionId,
}) {
  const paidAt = new Intl.DateTimeFormat('en-BD', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date())

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 sm:px-6">
      <section className="mx-auto max-w-2xl">
        <div className="mb-6 text-center print:hidden">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
            ✓
          </div>
          <h1 className="text-3xl font-bold">Payment successful</h1>
          <p className="mt-2 text-sm text-slate-500">
            Your payment receipt is ready to download.
          </p>
        </div>

        <article id="payment-receipt" className="rounded-2xl bg-white p-6 shadow-xl sm:p-10 print:shadow-none">
          <header className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <p className="text-2xl font-extrabold text-indigo-600">TechBasket</p>
              <p className="mt-1 text-xs text-slate-500">Payment receipt</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
              {paymentStatus}
            </span>
          </header>

          <div className="grid gap-5 border-b border-slate-200 py-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Billed to</p>
              <p className="mt-1 break-all text-sm font-medium">{customerEmail}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Payment date</p>
              <p className="mt-1 text-sm font-medium">{paidAt}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-slate-200 py-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Plan</p>
              <p className="mt-1 text-sm font-semibold">{productName}</p>
            </div>
            <p className="text-xl font-bold">{amount}</p>
          </div>

          <div className="pt-6 text-xs text-slate-500">
            <p className="break-all">Payment ID: {sessionId}</p>
            <p className="mt-2">Thank you for choosing TechBasket.</p>
          </div>
        </article>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Download PDF
          </button>
          <Link
            href="/admin/Plans"
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to plans
          </Link>
        </div>
      </section>
    </main>
  )
}