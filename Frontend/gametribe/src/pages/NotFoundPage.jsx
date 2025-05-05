<<<<<<< HEAD
import { Link } from 'react-router-dom';
import '../styles/TeamPage.css';
=======
// NotFoundPage.jsx - 404 page component
import { Link } from 'react-router-dom';
>>>>>>> order-confirmation-history

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
<<<<<<< HEAD
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">
        Return to Home
      </Link>
=======
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
>>>>>>> order-confirmation-history
    </div>
  );
};

export default NotFoundPage;