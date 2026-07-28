import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function Wishlist() {
  const [products, setProducts] = useState(null);

  const load = () => api.get('/wishlist').then(({ data }) => setProducts(data.products));
  useEffect(() => { load(); }, []);

  if (!products) return <Loader />;

  return (
    <div className="container py-5">
      <h1 className="section-title" data-aos="fade-up">My <span>Wishlist</span></h1>
      <p className="section-subtitle" data-aos="fade-up">{products.length} item(s) saved for later</p>

      {products.length === 0 ? (
        <div className="text-center py-5">
          <i className="fa-solid fa-heart-crack fa-3x text-muted mb-3"></i>
          <h5>Your wishlist is empty</h5>
          <p className="text-muted">Save items you love to buy them later.</p>
          <Link to="/products" className="btn btn-primary-brand mt-2">Browse Products</Link>
        </div>
      ) : (
        <div className="row g-3 g-lg-4">
          {products.map((p) => <ProductCard key={p._id} product={p} isWishlisted={true} />)}
        </div>
      )}
    </div>
  );
}
