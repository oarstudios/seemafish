import React from 'react'

function PrivacyPolicy() {
  return (
    <div className='policies'>
      <h1>Privacy Policy</h1>
      <p className='pd'>
        At FreshiMeat, we value your privacy. This policy outlines how we collect, use, and protect your data.
      </p>

      <div>
        <h2>1. Data Collection</h2>
        <p>We collect your name, email, phone number, address, and payment details during order placement.</p>
      </div>

      <div>
        <h2>2. Data Usage</h2>
        <p>We use your data to:</p>
        <ul>
          <li>Process orders</li>
          <li>Deliver products</li>
          <li>Improve customer experience</li>
        </ul>
        <p>We do not sell or rent your personal data to third parties.</p>
      </div>

      <div>
        <h2>3. Cookies</h2>
        <p>We use cookies to enhance user experience and track website usage.</p>
      </div>

      <div>
        <h2>4. Data Security</h2>
        <p>We implement appropriate security measures to protect your information.</p>
      </div>

      <div>
        <h2>5. Your Rights</h2>
        <p>You may request to review or delete your personal data by contacting us.</p>
      </div>
    </div>
  )
}

export default PrivacyPolicy
