import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../firebase';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyEmail = async () => {
      const actionCode = searchParams.get('oobCode');
      
      if (!actionCode) {
        setStatus('error');
        setError('Invalid verification link. Please request a new verification email.');
        return;
      }
      
      try {
        await applyActionCode(auth, actionCode);
        setStatus('success');
        
        // Update the user's email verification status
        if (auth.currentUser) {
          await auth.currentUser.reload();
        }
        
        // Redirect after a delay
        setTimeout(() => {
          navigate('/verify-email-success');
        }, 3000);
      } catch (error) {
        console.error('Error verifying email:', error);
        setStatus('error');
        
        if (error.code === 'auth/invalid-action-code') {
          setError('This verification link has expired or already been used. Please request a new verification email.');
        } else {
          setError('Failed to verify your email. Please try again later.');
        }
      }
    };
    
    verifyEmail();
  }, [searchParams, navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Email Verification</h1>
      
      {status === 'loading' && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hamutea-red mx-auto mb-4"></div>
          <p>Verifying your email address...</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="text-center">
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
            <p className="font-bold">Email Verified Successfully!</p>
            <p>Your email has been verified. You will be redirected shortly.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-hamutea-red text-white px-4 py-2 rounded-full"
          >
            Go to Home
          </button>
        </div>
      )}
      
      {status === 'error' && (
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p className="font-bold">Verification Failed</p>
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

export default VerifyEmail;