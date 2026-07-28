import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [sections, setSections] = useState(null);
  const [categories, setCategories] = useState([]);
  const [wishlistedIds, setWishlistedIds] = useState([]);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    api.get('/products/home/sections').then(({ data }) => setSections(data));
    api.get('/categories').then(({ data }) => setCategories(data.categories.slice(0, 6)));
    if (user) {
      api.get('/wishlist').then(({ data }) => setWishlistedIds(data.products.map((p) => p._id)));
    }
  }, [user]);

  useEffect(() => {
    const end = new Date();
    end.setHours(end.getHours() + 18);
    const timer = setInterval(() => {
      const distance = end - new Date();
      if (distance < 0) { clearInterval(timer); return; }
      setCountdown({
        d: Math.floor(distance / 86400000),
        h: Math.floor((distance % 86400000) / 3600000),
        m: Math.floor((distance % 3600000) / 60000),
        s: Math.floor((distance % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!sections) return <Loader />;

  const { featured, bestsellers, latest, flashSale } = sections;

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <span className="hero-badge"><i className="fa-solid fa-bolt"></i> New Season Arrivals</span>
              <h1>Shop Premium Products, <br />Delivered To Your Door.</h1>
              <p>Discover electronics, fashion, home essentials and more — all at prices that make sense.</p>
              <div className="d-flex gap-3 mt-4">
                <Link to="/products" className="btn btn-light btn-lg rounded-pill px-4 fw-semibold">Shop Now</Link>
                <Link to="/categories" className="btn btn-outline-light btn-lg rounded-pill px-4">Browse Categories</Link>
              </div>
            </div>
            <div className="col-lg-6 mt-5 mt-lg-0" data-aos="fade-left">
              <div className="hero-img-wrap">
                <img src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=80" className="img-fluid" alt="Premium Shopping" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="section-title" data-aos="fade-up">Shop by <span>Category</span></h2>
        <p className="section-subtitle" data-aos="fade-up">Explore our most popular collections</p>
        <div className="row g-3 g-lg-4">
          {categories.map((cat) => (
            <div className="col-6 col-md-4 col-lg-2" key={cat._id} data-aos="zoom-in">
              <Link to={`/products?category=${cat.slug}`} className="text-reset">
                <div className="category-card">
                  <div className="cat-icon"><i className={cat.icon}></i></div>
                  <h6 className="mb-0">{cat.name}</h6>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-4">
        <h2 className="section-title" data-aos="fade-up">Featured <span>Products</span></h2>
        <p className="section-subtitle" data-aos="fade-up">Hand-picked items just for you</p>
        <div className="row g-3 g-lg-4">
          {featured.map((p) => <ProductCard key={p._id} product={p} isWishlisted={wishlistedIds.includes(p._id)} />)}
        </div>
      </section>

      {flashSale.length > 0 && (
        <section className="container py-4">
          <div className="flash-sale-band" data-aos="fade-up">
            <div className="row align-items-center mb-4">
              <div className="col-md-6">
                <h3 className="mb-1"><i className="fa-solid fa-bolt me-2"></i>Flash Sale</h3>
                <p className="mb-0">Grab these limited-time deals before they're gone!</p>
              </div>
              <div className="col-md-6 text-md-end mt-3 mt-md-0">
                <div className="countdown-box justify-content-md-end">
                  <div className="cbox"><strong>{countdown.d}</strong>Days</div>
                  <div className="cbox"><strong>{countdown.h}</strong>Hrs</div>
                  <div className="cbox"><strong>{countdown.m}</strong>Min</div>
                  <div className="cbox"><strong>{countdown.s}</strong>Sec</div>
                </div>
              </div>
            </div>
            <div className="row g-3">
              {flashSale.map((p) => {
                const price = Math.round((p.price - (p.price * p.discountPercent) / 100) * 100) / 100;
                return (
                  <div className="col-6 col-md-3" key={p._id}>
                    <Link to={`/product/${p.slug}`} className="text-reset">
                      <div className="glass-card p-3 h-100" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' }}>
                        <img src={p.thumbnail} className="img-fluid rounded mb-2" alt={p.name} style={{ aspectRatio: '1/1', objectFit: 'cover' }} />
                        <div className="fw-semibold text-truncate text-white">{p.name}</div>
                        <div className="fw-bold text-white">₹{price.toFixed(2)} <small className="text-decoration-line-through opacity-75">₹{p.price.toFixed(2)}</small></div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="container py-4">
        <h2 className="section-title" data-aos="fade-up">Best <span>Sellers</span></h2>
        <p className="section-subtitle" data-aos="fade-up">Loved by thousands of happy customers</p>
        <div className="row g-3 g-lg-4">
          {bestsellers.map((p) => <ProductCard key={p._id} product={p} isWishlisted={wishlistedIds.includes(p._id)} />)}
        </div>
      </section>

      <section className="container py-4">
        <h2 className="section-title" data-aos="fade-up">Latest <span>Arrivals</span></h2>
        <p className="section-subtitle" data-aos="fade-up">Fresh off the shelf</p>
        <div className="row g-3 g-lg-4">
          {latest.map((p) => <ProductCard key={p._id} product={p} isWishlisted={wishlistedIds.includes(p._id)} />)}
        </div>
        <div className="text-center mt-4" data-aos="fade-up">
          <Link to="/products" className="btn btn-dark-brand btn-lg px-5">View All Products</Link>
        </div>
      </section>
    </>
  );
}
