export default function PrivacyPolicy() {
  return (
    <div className="container py-5">
      <div className="glass-card p-4 p-md-5 mx-auto" style={{ maxWidth: 900 }} data-aos="fade-up">
        <h1 className="section-title mb-4">Privacy <span>Policy</span></h1>
        <p className="text-muted">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

        <h5 className="mt-4">1. Information We Collect</h5>
        <p className="text-muted">We collect information you provide directly, such as your name, email, phone number, and shipping address when you register or place an order.</p>

        <h5 className="mt-4">2. How We Use Your Information</h5>
        <p className="text-muted">We use your data to process orders, provide customer support, personalize your shopping experience, and send order-related communications.</p>

        <h5 className="mt-4">3. Data Security</h5>
        <p className="text-muted">We implement password hashing, encrypted sessions, and validated inputs to protect your data against unauthorized access.</p>

        <h5 className="mt-4">4. Cookies & Local Storage</h5>
        <p className="text-muted">We use browser storage to keep you signed in and remember your preferences, such as dark mode settings.</p>

        <h5 className="mt-4">5. Third-Party Sharing</h5>
        <p className="text-muted">We do not sell your personal data. Information is shared only with payment processors and shipping partners as necessary to fulfill your orders.</p>

        <h5 className="mt-4">6. Your Rights</h5>
        <p className="text-muted">You may access, update, or request deletion of your personal data at any time by contacting our support team.</p>

        <h5 className="mt-4">7. Contact Us</h5>
        <p className="text-muted">For privacy-related questions, reach us at support@shopnex.com.</p>
      </div>
    </div>
  );
}
