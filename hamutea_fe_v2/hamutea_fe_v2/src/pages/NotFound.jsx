import { Link } from 'react-router-dom';
import Icon from '@components/common/Icon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="mb-8">
          <Icon name="AlertTriangle" className="w-24 h-24 text-hamutea-red mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-hamutea-red text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors duration-200"
          >
            <Icon name="Home" className="w-5 h-5" />
            Go Home
          </Link>
          
          <div className="text-sm text-gray-500">
            <Link to="/menu" className="text-hamutea-red hover:underline">
              Browse Menu
            </Link>
            {' • '}
            <Link to="/contact-us" className="text-hamutea-red hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;