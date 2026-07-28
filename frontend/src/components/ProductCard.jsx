import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';

function imageUrl(path) {
  if (!path) return '/placeholder.png';
  return path.startsWith('http') ? path : path;
}

function discountedPrice(price, discountPercent) {
  return Math.round((price - (price * discountPercent) / 100) * 100) / 100;
}

export default function ProductCard({ product, isWishlisted = false }) {
  const { user } = useAuth();
  const { addToCart, toggleWishlist } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const price = discountedPrice(product.price, product.discountPercent);
  const categoryName = product.category?.name;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      await addToCart(product._id, 1);
      showToast('Item added to cart!', 'success');
    } catch {
      showToast('Could not add to cart', 'danger');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      const data = await toggleWishlist(product._id);
      showToast(data.action === 'added' ? 'Added to wishlist' : 'Removed from wishlist', 'success');
    } catch {
      showToast('Something went wrong', 'danger');
    }
  };

  return (
    <div className="col-6 col-md-4 col-lg-3" data-aos="fade-up">
      <div className="product-card">
        <div className="pc-img-wrap">
          <Link to={`/product/${product.slug}`}>
            <img src={imageUrl(product.thumbnail)} alt={product.name} loading="lazy" />
          </Link>
          {product.discountPercent > 0 ? (
            <span className="pc-badge sale">-{product.discountPercent}%</span>
          ) : product.isFeatured ? (
            <span className="pc-badge">Featured</span>
          ) : null}
          <button className={`pc-wishlist-btn ${isWishlisted ? 'active' : ''}`} onClick={handleWishlist}>
            <i className="fa-solid fa-heart"></i>
          </button>
        </div>
        <div className="pc-body">
          {categoryName && <div className="pc-category">{categoryName}</div>}
          <div className="pc-title">
            <Link to={`/product/${product.slug}`} className="text-reset">{product.name}</Link>
          </div>
          <div className="pc-rating">
            <StarRating rating={product.ratingAvg} /> <span className="count">({product.ratingCount})</span>
          </div>
          <div className="pc-price-row">
            <span className="pc-price">₹{price.toFixed(2)}</span>
            {product.discountPercent > 0 && (
              <span className="pc-mrp">₹{product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="pc-actions">
            <button className="btn btn-primary-brand" onClick={handleAddToCart}>
              <i className="fa-solid fa-cart-plus me-1"></i>Add
            </button>
            <Link to={`/product/${product.slug}`} className="btn btn-outline-brand">View</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
