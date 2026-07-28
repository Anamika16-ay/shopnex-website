export default function TermsAndConditions() {
  return (
    <div className="container py-5">
      <div className="glass-card p-4 p-md-5 mx-auto" style={{ maxWidth: 900 }} data-aos="fade-up">
        <h1 className="section-title mb-4">Terms &amp; <span>Conditions</span></h1>
        <p className="text-muted">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

        <h5 className="mt-4">1. Acceptance of Terms</h5>
        <p className="text-muted">By accessing and using ShopNex, you agree to be bound by these Terms and Conditions and our Privacy Policy.</p>

        <h5 className="mt-4">2. Account Responsibilities</h5>
        <p className="text-muted">You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>

        <h5 className="mt-4">3. Orders & Pricing</h5>
        <p className="text-muted">All prices are listed in Indian Rupees (₹) and are subject to change without notice. We reserve the right to refuse or cancel any order.</p>

        <h5 className="mt-4">4. Payments</h5>
        <p className="text-muted">Payments must be completed through the accepted payment methods listed at checkout. Cash on Delivery orders may require confirmation via phone.</p>

        <h5 className="mt-4">5. Shipping & Delivery</h5>
        <p className="text-muted">Delivery timelines are estimates and may vary due to circumstances beyond our control, such as weather or courier delays.</p>

        <h5 className="mt-4">6. Limitation of Liability</h5>
        <p className="text-muted">ShopNex is not liable for indirect or consequential damages arising from the use of our platform or products purchased through it.</p>

        <h5 className="mt-4">7. Governing Law</h5>
        <p className="text-muted">These terms are governed by the laws of India.</p>
      </div>
    </div>
  );
}
