import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [wishlistedIds, setWishlistedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    if (user) api.get('/wishlist').then(({ data }) => setWishlistedIds(data.products.map((p) => p._id)));
  }, [user]);

  useEffect(() => {
    setLoading(true);
    const params = { search, category, brand, min_price: minPrice, max_price: maxPrice, sort, page };
    api.get('/products', { params }).then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, [search, category, brand, minPrice, maxPrice, sort, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-3 mb-4">
          <div className="glass-card p-4" data-aos="fade-right">
            <h5 className="mb-3"><i className="fa-solid fa-filter me-2"></i>Filters</h5>

            <label className="form-label fw-semibold small">Category</label>
            <select className="form-select mb-3" value={category} onChange={(e) => updateParam('category', e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
            </select>

            <label className="form-label fw-semibold small">Brand</label>
            <select className="form-select mb-3" value={brand} onChange={(e) => updateParam('brand', e.target.value)}>
              <option value="">All Brands</option>
              {(data?.brands || []).map((b) => <option key={b} value={b}>{b}</option>)}
            </select>

            <label className="form-label fw-semibold small">Price Range (₹)</label>
            <div className="d-flex gap-2 mb-3">
              <input type="number" className="form-control" placeholder="Min" value={minPrice}
                onChange={(e) => updateParam('min_price', e.target.value)} />
              <input type="number" className="form-control" placeholder="Max" value={maxPrice}
                onChange={(e) => updateParam('max_price', e.target.value)} />
            </div>

            <button className="btn btn-outline-brand w-100" onClick={() => setSearchParams({})}>Clear All Filters</button>
          </div>
        </div>

        <div className="col-lg-9">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
            <h4 className="mb-0">
              {data?.totalItems ?? 0} Product{data?.totalItems === 1 ? '' : 's'} Found {search && `for "${search}"`}
            </h4>
            <div className="d-flex align-items-center gap-2">
              <label className="small text-muted mb-0">Sort by:</label>
              <select className="form-select form-select-sm" style={{ width: 'auto' }} value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {loading ? <Loader /> : !data?.products?.length ? (
            <div className="text-center py-5">
              <i className="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
              <h5>No products found</h5>
              <p className="text-muted">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <>
              <div className="row g-3 g-lg-4">
                {data.products.map((p) => <ProductCard key={p._id} product={p} isWishlisted={wishlistedIds.includes(p._id)} />)}
              </div>

              {data.totalPages > 1 && (
                <nav className="mt-5">
                  <ul className="pagination justify-content-center">
                    {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                      <li key={p} className={`page-item ${p === data.currentPage ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => goToPage(p)}>{p}</button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
