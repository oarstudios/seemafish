import React from 'react'

function RefundPolicy() {
  return (
    <div className='policies'>
      <h1>Refund & Cancellation Policy</h1>
      <p className='pd'>
        We want you to be happy with your order. Please review our refund and cancellation terms below:
      </p>

      <div>
        <h2>1. Cancellation</h2>
        <p>Orders can be cancelled within 15 minutes of placing them. Contact us immediately via phone or WhatsApp.</p>
      </div>

      <div>
        <h2>2. Refunds</h2>
        <p>Refunds will be processed if:</p>
        <ul>
          <li>Product is not delivered</li>
          <li>You received the wrong item</li>
          <li>The product is spoiled or damaged</li>
        </ul>
        <p>Refunds will be processed within 5–7 business days via the original payment method.</p>
      </div>

      <div>
        <h2>3. No Refunds</h2>
        <p>Refunds will not be provided if the product was delivered as per order and no issue was reported within 2 hours.</p>
      </div>
    </div>
  )
}

export default RefundPolicy
