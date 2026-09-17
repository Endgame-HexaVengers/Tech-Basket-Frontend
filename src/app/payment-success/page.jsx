import { redirect } from 'next/navigation'

import PaymentReceipt from '@/components/Subscription/PaymentReceipt'
import { stripe } from '@/lib/stripe'

export default async function PaymentSuccessPage({ searchParams }) {
  const { session_id: sessionId } = await searchParams

  if (!sessionId) {
    return redirect('/admin/Plans')
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'payment_intent'],
  })

  if (session.status !== 'complete') {
    return redirect('/admin/Plans')
  }

  const lineItem = session.line_items?.data?.[0]
  const amount = new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: session.currency || 'bdt',
  }).format((session.amount_total || 0) / 100)

  return (
    <PaymentReceipt
      amount={amount}
      customerEmail={session.customer_details?.email || 'Not provided'}
      paymentStatus={session.payment_status || 'paid'}
      productName={lineItem?.description || 'TechBasket subscription'}
      sessionId={session.id}
    />
  )
}