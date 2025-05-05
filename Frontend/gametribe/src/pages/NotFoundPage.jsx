<<<<<<< HEAD
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import '../assets/styles/TeamPage.css';
=======
import '../styles/TeamPage.css';
=======
// NotFoundPage.jsx - 404 page component
import { Link } from 'react-router-dom';
>>>>>>> order-confirmation-history
>>>>>>> 68cd02cd03f5580ab9f38ffc8ad97544b32131af

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