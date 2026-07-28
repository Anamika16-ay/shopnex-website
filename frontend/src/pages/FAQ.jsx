import { useState } from 'react';

const faqs = [
  { q: 'How do I track my order?', a: 'Go to "My Orders" from your account menu to view real-time status and tracking progress for every order you have placed.' },
  { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery, Credit/Debit Cards, and UPI payments. All online transactions are processed securely.' },
  { q: 'What is your return policy?', a: 'Most items can be returned within 7 days of delivery in original condition. Visit our Return Policy page for full details.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3-7 business days depending on your location. Orders above ₹999 qualify for free shipping.' },
  { q: 'Can I cancel my order?', a: 'Yes, orders can be cancelled before they are shipped. Go to My Orders and select the order you wish to cancel.' },
  { q: 'Is my payment information secure?', a: 'Absolutely. We use industry-standard encryption and never store your full card details on our servers.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="container py-5">
      <div className="text-center mb-5" data-aos="fade-up">
        <h1 className="section-title">Frequently Asked <span>Questions</span></h1>
        <p className="section-subtitle">Everything you need to know</p>
      </div>

      <div className="mx-auto" style={{ maxWidth: 800 }} data-aos="fade-up">
        {faqs.map((faq, i) => (
          <div className="glass-card mb-3" key={i}>
            <button
              className="btn w-100 text-start p-3 d-flex justify-content-between align-items-center"
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            >
              <span className="fw-semibold">{faq.q}</span>
              <i className={`fa-solid ${openIndex === i ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </button>
            {openIndex === i && (
              <div className="p-3 pt-0 text-muted">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
