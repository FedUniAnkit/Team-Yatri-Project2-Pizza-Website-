import React from 'react';
import './TermsAndConditions.css';


const TermsAndConditions = () => {
  return (
    <div className="terms-page">
      <div className="terms-container">
        <h1 className="terms-title">Terms and Conditions</h1>
        <p className="terms-updated">Last updated: {new Date().toLocaleDateString('en-AU', { dateStyle: 'long' })}</p>

        <section className="terms-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Komorebi Pizza. These Terms and Conditions govern your use of our website and
            services. By accessing or using our website, placing an order, or creating an account,
            you agree to be bound by these terms. If you do not agree, please do not use our services.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Ordering & Payment</h2>
          <ul>
            <li>All orders are subject to availability and confirmation of the order price.</li>
            <li>Prices are listed in Australian Dollars (AUD) and include GST where applicable.</li>
            <li>We accept payment via credit/debit card and cash on delivery.</li>
            <li>Payment must be completed at the time of placing the order for online payments.</li>
            <li>We reserve the right to refuse or cancel any order at our discretion.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>3. Delivery</h2>
          <ul>
            <li>Delivery times are estimates and may vary depending on demand and location.</li>
            <li>We deliver within a specified radius of our store location.</li>
            <li>A delivery fee may apply depending on your location and order total.</li>
            <li>You are responsible for providing accurate delivery information.</li>
            <li>If delivery cannot be completed due to incorrect information, a re-delivery fee may apply.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>4. Cancellations & Refunds</h2>
          <ul>
            <li>Orders can be cancelled before they enter the preparation stage.</li>
            <li>Once an order is being prepared, it cannot be cancelled.</li>
            <li>Refunds for cancelled orders will be processed within 5–10 business days.</li>
            <li>If you receive an incorrect or damaged order, please contact us immediately for a replacement or refund.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>5. User Accounts</h2>
          <ul>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You must provide accurate and complete information when creating an account.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            <li>You must be at least 16 years old to create an account.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>6. Privacy</h2>
          <p>
            We collect and process personal data in accordance with Australian privacy laws.
            Your information is used solely for order processing, account management, and
            improving our services. We do not sell or share your personal data with third parties
            for marketing purposes without your consent.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. Allergies & Dietary Information</h2>
          <p>
            While we take care to provide accurate dietary and allergen information, our products
            may contain or come into contact with common allergens including gluten, dairy, nuts,
            and seafood. Please inform us of any allergies when placing your order. We cannot
            guarantee a completely allergen-free environment.
          </p>
        </section>

        <section className="terms-section">
          <h2>8. Promotions & Discounts</h2>
          <ul>
            <li>Promotional offers are subject to specific terms and may have expiry dates.</li>
            <li>Promo codes cannot be combined with other offers unless stated otherwise.</li>
            <li>We reserve the right to withdraw any promotion at any time.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>9. Intellectual Property</h2>
          <p>
            All content on this website, including logos, images, text, and design, is the property
            of Komorebi Pizza and is protected by copyright and intellectual property laws. You may
            not reproduce, distribute, or use any content without prior written permission.
          </p>
        </section>

        <section className="terms-section">
          <h2>10. Limitation of Liability</h2>
          <p>
            Komorebi Pizza shall not be liable for any indirect, incidental, or consequential
            damages arising from the use of our website or services. Our total liability is limited
            to the amount paid for the specific order in question.
          </p>
        </section>

        <section className="terms-section">
          <h2>11. Changes to Terms</h2>
          <p>
            We may update these Terms and Conditions from time to time. Changes will be posted on
            this page with the updated date. Continued use of our services after changes constitutes
            acceptance of the revised terms.
          </p>
        </section>

        <section className="terms-section">
          <h2>12. Contact Us</h2>
          <p>If you have any questions about these Terms and Conditions, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> support@komorebipizza.com.au</li>
            <li><strong>Phone:</strong> (08) 8555 1234</li>
            <li><strong>Address:</strong> 65 Scottish Ave, Clovelly Park SA 5042</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
