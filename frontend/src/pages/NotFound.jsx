import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <div className="py-5" data-aos="zoom-in">
        <h1 className="fw-bold text-brand" style={{ fontSize: '8rem' }}>404</h1>
        <h3 className="mb-3">Oops! Page Not Found</h3>
        <p className="text-muted mb-4">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary-brand btn-lg px-5">Back to Home</Link>
      </div>
    </div>
  );
}
