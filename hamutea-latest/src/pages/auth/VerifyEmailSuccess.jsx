import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VerifyEmailSuccess = () => {
  const { currentUser, updateUser } = useAuth();
  
  useEffect(() => {
    // Update the user's email verification status in context if logged in
    if (currentUser) {
      updateUser({
        ...currentUser,
        emailVerified: true
      });
    }
  }, [currentUser, updateUser]);
  
  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-green-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">Email Verified Successfully!</h1>
      
      <p className="text-center text-gray-600 mb-6">
        Your email address has been verified. You can now access all features of your account.
      </p>
      
      <div className="flex flex-col space-y-3 w-full">
        <Link
          to="/"
          className="bg-hamutea-red text-white px-6 py-2 rounded-full text-center"
        >
          Go to Home
        </Link>
        
        <Link
          to="/account"
          className="border border-hamutea-red text-hamutea-red px-6 py-2 rounded-full text-center"
        >
          View Your Account
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailSuccess;