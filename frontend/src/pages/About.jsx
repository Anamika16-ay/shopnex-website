export default function About() {
  return (
    <>
      <section className="hero-section" style={{ padding: '60px 0' }}>
        <div className="container text-center" data-aos="fade-up">
          <h1>About <span style={{ color: '#fff' }}>ShopNex</span></h1>
          <p className="mb-0">Premium shopping, honest prices, delivered with care.</p>
        </div>
      </section>

      <div className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6" data-aos="fade-right">
            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" className="img-fluid rounded-xl" alt="Our story" />
          </div>
          <div className="col-lg-6" data-aos="fade-left">
            <h2 className="section-title">Our <span>Story</span></h2>
            <p className="text-muted">ShopNex started with a simple idea: shopping online should feel effortless, trustworthy, and even enjoyable. From electronics to fashion, home essentials to beauty, we bring together quality products and a seamless experience — all in one place.</p>
            <p className="text-muted">Today we serve thousands of happy customers with fast delivery, secure payments, and a support team that genuinely cares.</p>
            <div className="row mt-4 g-3">
              <div className="col-4 text-center"><h3 className="text-brand fw-bold mb-0">50K+</h3><small className="text-muted">Happy Customers</small></div>
              <div className="col-4 text-center"><h3 className="text-brand fw-bold mb-0">10K+</h3><small className="text-muted">Products</small></div>
              <div className="col-4 text-center"><h3 className="text-brand fw-bold mb-0">99%</h3><small className="text-muted">Satisfaction</small></div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-5">
          {[
            ['fa-shield-halved', 'Trusted & Secure', 'Bank-grade encryption on every transaction, every time.'],
            ['fa-truck-fast', 'Fast Delivery', 'Quick, reliable shipping to your doorstep nationwide.'],
            ['fa-headset', '24/7 Support', 'Our team is always here to help, day or night.'],
          ].map(([icon, title, desc]) => (
            <div className="col-md-4" key={title} data-aos="fade-up">
              <div className="glass-card p-4 text-center h-100">
                <i className={`fa-solid ${icon} fa-2x text-brand mb-3`}></i>
                <h5>{title}</h5>
                <p className="text-muted small mb-0">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
