import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ReturnPolicy from './pages/ReturnPolicy';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import ManageCustomers from './pages/admin/ManageCustomers';
import Reports from './pages/admin/Reports';

function StoreLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* ---------- Admin routes (no store header/footer) ---------- */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
      <Route path="/admin/products" element={<AdminProtectedRoute><ManageProducts /></AdminProtectedRoute>} />
      <Route path="/admin/orders" element={<AdminProtectedRoute><ManageOrders /></AdminProtectedRoute>} />
      <Route path="/admin/customers" element={<AdminProtectedRoute><ManageCustomers /></AdminProtectedRoute>} />
      <Route path="/admin/reports" element={<AdminProtectedRoute><Reports /></AdminProtectedRoute>} />

      {/* ---------- Storefront routes ---------- */}
      <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
      <Route path="/about" element={<StoreLayout><About /></StoreLayout>} />
      <Route path="/products" element={<StoreLayout><Products /></StoreLayout>} />
      <Route path="/product/:slug" element={<StoreLayout><ProductDetails /></StoreLayout>} />
      <Route path="/categories" element={<StoreLayout><Categories /></StoreLayout>} />
      <Route path="/wishlist" element={<StoreLayout><ProtectedRoute><Wishlist /></ProtectedRoute></StoreLayout>} />
      <Route path="/cart" element={<StoreLayout><ProtectedRoute><Cart /></ProtectedRoute></StoreLayout>} />
      <Route path="/checkout" element={<StoreLayout><ProtectedRoute><Checkout /></ProtectedRoute></StoreLayout>} />
      <Route path="/order-success/:orderNumber" element={<StoreLayout><ProtectedRoute><OrderSuccess /></ProtectedRoute></StoreLayout>} />
      <Route path="/orders" element={<StoreLayout><ProtectedRoute><Orders /></ProtectedRoute></StoreLayout>} />
      <Route path="/profile" element={<StoreLayout><ProtectedRoute><Profile /></ProtectedRoute></StoreLayout>} />
      <Route path="/login" element={<StoreLayout><Login /></StoreLayout>} />
      <Route path="/register" element={<StoreLayout><Register /></StoreLayout>} />
      <Route path="/forgot-password" element={<StoreLayout><ForgotPassword /></StoreLayout>} />
      <Route path="/reset-password" element={<StoreLayout><ResetPassword /></StoreLayout>} />
      <Route path="/contact" element={<StoreLayout><Contact /></StoreLayout>} />
      <Route path="/faq" element={<StoreLayout><FAQ /></StoreLayout>} />
      <Route path="/privacy-policy" element={<StoreLayout><PrivacyPolicy /></StoreLayout>} />
      <Route path="/terms-and-conditions" element={<StoreLayout><TermsAndConditions /></StoreLayout>} />
      <Route path="/return-policy" element={<StoreLayout><ReturnPolicy /></StoreLayout>} />
      <Route path="*" element={<StoreLayout><NotFound /></StoreLayout>} />
    </Routes>
  );
}
