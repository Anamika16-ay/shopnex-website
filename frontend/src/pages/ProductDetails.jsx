import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductDetails() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToCart, toggleWishlist } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [reviewForm, setReviewForm] = useState({ rating: '', title: '', comment: '' });

  useEffect(() => {
    setData(null);
    api.get(`/products/${slug}`).then(({ data }) => {
      setData(data);
      setMainImage(data.product.thumbnail);
      setQty(1);
    }).catch(() => navigate('/products'));
  }, [slug]);

  if (!data) return <Loader />;

  const { product, related, isWishlisted } = data;
  const price = Math.round((product.price - (product.price * product.discountPercent) / 100) * 100) / 100;
  const images = product.images?.length ? product.images : [product.thumbnail];

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await addToCart(product._id, qty);
      showToast('Item added to cart!', 'success');
    } catch { showToast('Could not add to cart', 'danger'); }
  };

  const handleWishlist = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const d = await toggleWishlist(product._id);
      showToast(d.action === 'added' ? 'Added to wishlist' : 'Removed from wishlist', 'success');
    } catch { showToast('Something went wrong', 'danger'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { productId: product._id, ...reviewForm });
      showToast('Thank you! Your review has been submitted.', 'success');
      setReviewForm({ rating: '', title: '', comment: '' });
      const { data: fresh } = await api.get(`/products/${slug}`);
      setData(fresh);
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not submit review', 'danger');
    }
  };

  return (
    <div className="container py-5">
      <nav className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to={`/products?category=${product.category.slug}`}>{product.category.name}</Link></li>
          <li className="breadcrumb-item active">{product.name}</li>
        </ol>
      </nav>

      <div className="row g-5">
        <div className="col-lg-6" data-aos="fade-right">
          <div className="glass-card p-3 mb-3">
            <img src={mainImage} className="img-fluid rounded-xl w-100" alt={product.name} style={{ aspectRatio: '1/1', objectFit: 'cover' }} />
          </div>
          <div className="d-flex gap-2 flex-wrap">
            {images.map((img, i) => (
              <img key={i} src={img} className="rounded border" style={{ width: 76, height: 76, objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => setMainImage(img)} />
            ))}
          </div>
        </div>

        <div className="col-lg-6" data-aos="fade-left">
          <span className="pc-category">{product.category.name}{product.brand && ` • ${product.brand}`}</span>
          <h1 className="h3 mt-2">{product.name}</h1>
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="pc-rating"><StarRating rating={product.ratingAvg} /></span>
            <span className="text-muted small">{product.ratingAvg} ({product.ratingCount} reviews)</span>
            <span className="divider-dot"></span>
            <span className={`badge ${product.stockQuantity > 0 ? 'text-bg-success' : 'text-bg-danger'}`}>
              {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="d-flex align-items-center gap-3 mb-4">
            <span className="fs-3 fw-bold text-brand">₹{price.toFixed(2)}</span>
            {product.discountPercent > 0 && (
              <>
                <span className="fs-5 text-muted text-decoration-line-through">₹{product.price.toFixed(2)}</span>
                <span className="badge text-bg-danger">-{product.discountPercent}% OFF</span>
              </>
            )}
          </div>

          <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>{product.description}</p>

          <div className="d-flex align-items-center gap-3 my-4">
            <span className="fw-semibold">Quantity:</span>
            <div className="qty-control d-flex align-items-center border rounded-pill overflow-hidden">
              <button type="button" className="btn px-3" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <input type="number" value={qty} min="1" max={product.stockQuantity}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || 1, 10)))}
                className="form-control border-0 text-center" style={{ width: 60 }} />
              <button type="button" className="btn px-3" onClick={() => setQty(Math.min(product.stockQuantity, qty + 1))}>+</button>
            </div>
          </div>

          <div className="d-flex gap-3 mb-4">
            <button className="btn btn-primary-brand btn-lg flex-fill" onClick={handleAddToCart} disabled={product.stockQuantity < 1}>
              <i className="fa-solid fa-cart-plus me-2"></i>Add to Cart
            </button>
            <Link to={user ? `/checkout?buyNow=${product._id}` : '/login'} className="btn btn-dark-brand btn-lg flex-fill">
              <i className="fa-solid fa-bolt me-2"></i>Buy Now
            </Link>
            <button className={`btn btn-outline-brand btn-lg ${isWishlisted ? 'active' : ''}`} onClick={handleWishlist}>
              <i className="fa-solid fa-heart"></i>
            </button>
          </div>

          <div className="glass-card p-3 small text-muted">
            <div className="mb-1"><i className="fa-solid fa-truck-fast me-2 text-brand"></i>Free delivery on orders above ₹999</div>
            <div className="mb-1"><i className="fa-solid fa-rotate-left me-2 text-brand"></i>7-day easy returns</div>
            <div><i className="fa-solid fa-shield-halved me-2 text-brand"></i>100% secure payment</div>
          </div>
        </div>
      </div>

      <div className="mt-5" data-aos="fade-up">
        <ul className="nav nav-tabs">
          <li className="nav-item"><button className={`nav-link ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>Specifications</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews ({product.reviews?.length ?? product.ratingCount})</button></li>
        </ul>
        <div className="glass-card p-4" style={{ borderTopLeftRadius: 0 }}>
          {activeTab === 'specs' ? (
            product.specifications ? (
              <ul className="list-unstyled mb-0">
                {product.specifications.split('\n').filter(Boolean).map((line, i) => (
                  <li key={i} className="py-2 border-bottom"><i className="fa-solid fa-check text-brand me-2"></i>{line}</li>
                ))}
              </ul>
            ) : <p className="text-muted mb-0">No specifications listed for this product.</p>
          ) : (
            <>
              {user ? (
                <form onSubmit={handleReviewSubmit} className="mb-4">
                  <h6>Write a Review</h6>
                  <select className="form-select mb-2" style={{ width: 150 }} required
                    value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}>
                    <option value="">Rating</option>
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                  <input type="text" className="form-control mb-2" placeholder="Review title"
                    value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} />
                  <textarea className="form-control mb-2" rows="3" placeholder="Share your experience..." required
                    value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}></textarea>
                  <button className="btn btn-primary-brand">Submit Review</button>
                </form>
              ) : <p><Link to="/login">Login</Link> to write a review.</p>}
            </>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-5">
          <h3 className="section-title" data-aos="fade-up">Related <span>Products</span></h3>
          <div className="row g-3 g-lg-4">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
