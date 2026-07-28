import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

export default function Categories() {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  if (!categories) return <Loader />;

  return (
    <div className="container py-5">
      <div className="text-center mb-5" data-aos="fade-up">
        <h1 className="section-title">Shop by <span>Category</span></h1>
        <p className="section-subtitle">Browse our full range of product categories</p>
      </div>

      <div className="row g-4">
        {categories.map((cat) => (
          <div className="col-6 col-md-4 col-lg-3" key={cat._id} data-aos="zoom-in">
            <Link to={`/products?category=${cat.slug}`} className="text-reset">
              <div className="category-card">
                <div className="cat-icon"><i className={cat.icon}></i></div>
                <h6 className="mb-1">{cat.name}</h6>
                <small className="text-muted">{cat.productCount} Products</small>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
