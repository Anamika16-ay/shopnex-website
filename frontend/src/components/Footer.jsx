import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    showToast('Thanks for subscribing! Check your inbox for confirmation.', 'success');
    setEmail('');
  };

  return (
    <footer className="site-footer">
      <div className="newsletter-band">
        <div className="container">
          <div className="row align-items-center g-3">
            <div className="col-lg-6">
              <h4 className="mb-1"><i className="fa-solid fa-envelope-open-text me-2"></i>Subscribe to our Newsletter</h4>
              <p className="mb-0 text-muted">Get exclusive deals, new arrivals and offers straight to your inbox.</p>
            </div>
            <div className="col-lg-6">
              <form className="d-flex gap-2" onSubmit={handleNewsletter}>
                <input type="email" className="form-control" placeholder="Enter your email address" required
                  value={email} onChange={(e) => setEmail(e.target.value)} />
                <button className="btn btn-primary-brand px-4" type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-brand">Shop<span>Nex</span></h5>
            <p className="text-muted small">Your one-stop premium destination for electronics, fashion, home essentials and more — delivered fast, priced fair.</p>
            <div className="social-links">
              <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#"><i className="fa-brands fa-instagram"></i></a>
              <a href="#"><i className="fa-brands fa-twitter"></i></a>
              <a href="#"><i className="fa-brands fa-youtube"></i></a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h6 className="footer-heading">Customer Service</h6>
            <ul className="footer-links">
              <li><Link to="/orders">Track Your Order</Link></li>
              <li><Link to="/return-policy">Return Policy</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h6 className="footer-heading">Contact Info</h6>
            <ul className="footer-links">
              <li><i className="fa-solid fa-location-dot me-2"></i>Lucknow, Uttar Pradesh, India</li>
              <li><i className="fa-solid fa-phone me-2"></i>+91 98765 43210</li>
              <li><i className="fa-solid fa-envelope me-2"></i>support@shopnex.com</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 py-3">
          <span className="small">&copy; {new Date().getFullYear()} ShopNex. All rights reserved.</span>
          <span className="small">Built with <i className="fa-solid fa-heart text-danger"></i> for modern shopping.</span>
        </div>
      </div>
    </footer>
  );
}
