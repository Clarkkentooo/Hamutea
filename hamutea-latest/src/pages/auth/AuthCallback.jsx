import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userData = JSON.parse(atob(searchParams.get('user')));
        
        if (!token || !userData) {
          setStatus('error');
          setError('Invalid authentication data');
          return;
        }
        
        // Login the user
        login(userData, token);
        
        // Redirect to home
        navigate('/');
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setError('Failed to authenticate. Please try again.');
      }
    };
    
    handleCallback();
  }, [searchParams, navigate, login]);
  
  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication</h1>
      
      {status === 'loading' && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hamutea-red mx-auto mb-4"></div>
          <p>Completing authentication...</p>
        </div>
      )}
      
      {status === 'error' && (
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p className="font-bold">Authentication Failed</p>
            <p>{error}</p>
          </div>
          <button
            onClick={() => navigate('/sign-in')}
            className="bg-hamutea-red text-white px-4 py-2 rounded-full"
          >
            Back to Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;