import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { cartCount, wishlistCount } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (search.trim().length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(() => {
      api.get(`/products?search=${encodeURIComponent(search)}&limit=8`)
        .then(({ data }) => setSuggestions(data.products))
        .catch(() => setSuggestions([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <>
      <div className="top-bar d-none d-md-block">
        <div className="container d-flex justify-content-between align-items-center py-1">
          <span><i className="fa-solid fa-truck-fast me-1"></i> Free shipping on orders above ₹999</span>
          <div className="d-flex gap-3">
            <Link to="/contact">Help Center</Link>
            <Link to="/orders">Track Order</Link>
          </div>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg sticky-top main-navbar">
        <div className="container">
          <Link className="navbar-brand" to="/">Shop<span>Nex</span></Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <i className="fa-solid fa-bars"></i>
          </button>

          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav mx-auto main-nav-links">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Categories</a>
                <ul className="dropdown-menu">
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <Link className="dropdown-item" to={`/products?category=${cat.slug}`}>
                        <i className={`${cat.icon} me-2`}></i>{cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
            </ul>

            <form className="d-flex search-form position-relative" onSubmit={handleSearchSubmit}>
              <input
                className="form-control" type="search" placeholder="Search products, brands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <button className="btn" type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
              {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions active">
                  {suggestions.map((p) => (
                    <Link key={p._id} to={`/product/${p.slug}`}>{p.name}</Link>
                  ))}
                </div>
              )}
            </form>

            <ul className="navbar-nav align-items-lg-center icon-links">
              <li className="nav-item">
                <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle dark mode">
                  <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>
              </li>
              <li className="nav-item">
                <Link className="icon-btn" to="/wishlist" title="Wishlist">
                  <i className="fa-solid fa-heart"></i>
                  {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="icon-btn" to="/cart" title="Cart">
                  <i className="fa-solid fa-cart-shopping"></i>
                  {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a className="icon-btn dropdown-toggle" href="#" data-bs-toggle="dropdown" title="Account">
                  <i className="fa-solid fa-user"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  {user ? (
                    <>
                      <li className="dropdown-header">Hi, {user.fullName}</li>
                      <li><Link className="dropdown-item" to="/profile"><i className="fa-solid fa-user-pen me-2"></i>My Profile</Link></li>
                      <li><Link className="dropdown-item" to="/orders"><i className="fa-solid fa-box me-2"></i>My Orders</Link></li>
                      <li><Link className="dropdown-item" to="/wishlist"><i className="fa-solid fa-heart me-2"></i>Wishlist</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item text-danger" onClick={() => { logout(); navigate('/'); }}><i className="fa-solid fa-right-from-bracket me-2"></i>Logout</button></li>
                    </>
                  ) : (
                    <>
                      <li><Link className="dropdown-item" to="/login"><i className="fa-solid fa-right-to-bracket me-2"></i>Login</Link></li>
                      <li><Link className="dropdown-item" to="/register"><i className="fa-solid fa-user-plus me-2"></i>Register</Link></li>
                    </>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
