import { redirect } from 'next/navigation'

import { stripe } from '@/lib/stripe'
import PaymentReceipt from '@/components/Subscription/PaymentReceipt'

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status,
    customer_details: { email: customerEmail },
    amount_total: amountTotal,
    currency,
    id: sessionId,
    payment_status: paymentStatus,
    line_items: { data: lineItems },
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete') {
    const lineItem = lineItems?.[0]
    const productName = lineItem?.description || 'TechBasket subscription'
    const amount = new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: currency || 'bdt',
    }).format((amountTotal || 0) / 100)

    return (
      <PaymentReceipt
        amount={amount}
        customerEmail={customerEmail || 'Not provided'}
        paymentStatus={paymentStatus || 'paid'}
        productName={productName}
        sessionId={sessionId}
      />
    )
  }
}