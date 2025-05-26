import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyEmail = () => {
    const [status, setStatus] = useState('verifying');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const token = params.get('token');
                
                if (!token) {
                    setStatus('error');
                    return;
                }
                
                const response = await fetch(`http://localhost:5004/api/auth/verify-email?token=${token}`);
                
                if (response.ok) {
                    setStatus('success');
                    // Redirect to sign-in after 3 seconds
                    setTimeout(() => {
                        navigate('/sign-in?verified=true');
                    }, 3000);
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error('Email verification error:', error);
                setStatus('error');
            }
        };
        
        verifyEmail();
    }, [location.search, navigate]);

    return (
        <div className="relative z-20 bg-transparent bg-opacity-90 p-6 rounded-lg max-w-md w-full top-24 lg:top-48 left-1/2 -translate-x-1/2 sm:left-20 sm:translate-x-0 lg:left-32">
            <h1 className="text-2xl font-bold mb-6 text-center text-black">Email Verification</h1>
            
            {status === 'verifying' && (
                <div className="text-center">
                    <p className="mb-4 text-black">Verifying your email address...</p>
                    <div className="w-12 h-12 border-4 border-t-[#D91517] border-r-[#D91517] border-b-[#D91517] border-l-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            )}
            
            {status === 'success' && (
                <div className="text-center">
                    <p className="mb-4 text-green-600">Your email has been verified successfully!</p>
                    <p className="text-black">Redirecting to login page...</p>
                </div>
            )}
            
            {status === 'error' && (
                <div className="text-center">
                    <p className="mb-4 text-[#ff0000]">Failed to verify your email. The verification link may be invalid or expired.</p>
                    <button
                        onClick={() => navigate('/sign-in')}
                        className="bg-[#D91517] text-white px-4 py-2 rounded hover:bg-[#c01415] transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            )}
        </div>
    );
};

export default VerifyEmail;