import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { RecaptchaVerifier, PhoneAuthProvider, updatePhoneNumber, linkWithCredential } from 'firebase/auth';
import { auth } from '../../firebase';

const PhoneVerification = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Enter phone, 2: Enter code
    const [countdown, setCountdown] = useState(0);
    const { currentUser, updateUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Setup reCAPTCHA verifier
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'normal',
            'callback': () => {
                // reCAPTCHA solved, allow sending verification code
            },
            'expired-callback': () => {
                // Reset reCAPTCHA
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container');
            }
        });
        
        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
            }
        };
    }, []);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleSendCode = async (e) => {
        e.preventDefault();
        
        if (!phoneNumber.trim()) {
            setError('Please enter a valid phone number');
            return;
        }
        
        try {
            setLoading(true);
            setError('');
            
            // Format phone number to E.164 format if needed
            let formattedPhone = phoneNumber;
            if (!phoneNumber.startsWith('+')) {
                formattedPhone = `+${phoneNumber}`;
            }
            
            // Get reCAPTCHA verifier
            const appVerifier = window.recaptchaVerifier;
            
            // Send verification code
            const phoneProvider = new PhoneAuthProvider(auth);
            const verificationId = await phoneProvider.verifyPhoneNumber(formattedPhone, appVerifier);
            
            setVerificationId(verificationId);
            setStep(2);
            setCountdown(60); // 60 seconds cooldown
        } catch (error) {
            console.error('Error sending verification code:', error);
            setError('Failed to send verification code. Please try again.');
            
            // Reset reCAPTCHA
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        
        if (!verificationCode.trim()) {
            setError('Please enter the verification code');
            return;
        }
        
        try {
            setLoading(true);
            setError('');
            
            // Create credential
            const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
            
            // Link phone number to user account
            const user = auth.currentUser;
            await linkWithCredential(user, credential);
            
            // Update user data
            const updatedUser = {
                ...currentUser,
                phoneVerified: true,
                phone: phoneNumber
            };
            
            // Update user in context
            updateUser(updatedUser);
            
            // Navigate to home page
            navigate('/');
        } catch (error) {
            console.error('Error verifying code:', error);
            setError('Invalid verification code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative z-20 bg-transparent bg-opacity-90 p-6 rounded-lg max-w-md w-full top-24 lg:top-48 left-1/2 -translate-x-1/2 sm:left-20 sm:translate-x-0 lg:left-32">
            <h1 className="text-2xl font-bold mb-6 text-center text-black">Phone Verification</h1>
            <p className="mb-6 text-center text-gray-600">
                We need to verify your phone number for security purposes.
            </p>
            
            {error && (
                <p className="mb-4 text-[#ff0000] p-2 rounded" role="alert">
                    {error}
                </p>
            )}
            
            {step === 1 ? (
                <form onSubmit={handleSendCode}>
                    <div className="relative mb-4">
                        <input
                            id="phone"
                            type="tel"
                            className="peer w-full px-3 pt-4 pb-2 border-b border-gray-300 bg-transparent text-black focus:outline-none focus:ring-0 focus:border-[#D91517] transition"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            placeholder=" "
                            aria-required="true"
                        />
                        <label
                            htmlFor="phone"
                            className="absolute left-3 top-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[#D91517] peer-focus:text-sm"
                        >
                            Phone Number (e.g. +639123456789)
                        </label>
                    </div>
                    
                    <div id="recaptcha-container" className="mb-4"></div>
                    
                    <button
                        type="submit"
                        className="w-full bg-[#D91517] text-white py-3 transition-colors duration-200 mb-4 hover:bg-white hover:text-[#D91517] border border-[#D91517]"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Verification Code'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full bg-white border border-gray-300 text-gray-700 py-3 transition-colors duration-200"
                    >
                        Skip for Now
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyCode}>
                    <div className="relative mb-4">
                        <input
                            id="code"
                            type="text"
                            className="peer w-full px-3 pt-4 pb-2 border-b border-gray-300 bg-transparent text-black focus:outline-none focus:ring-0 focus:border-[#D91517] transition"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                            placeholder=" "
                            aria-required="true"
                        />
                        <label
                            htmlFor="code"
                            className="absolute left-3 top-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[#D91517] peer-focus:text-sm"
                        >
                            Verification Code
                        </label>
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-[#D91517] text-white py-3 transition-colors duration-200 mb-4 hover:bg-white hover:text-[#D91517] border border-[#D91517]"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Verify Code'}
                    </button>
                    
                    <div className="flex justify-between items-center mb-4">
                        <button
                            type="button"
                            onClick={() => {
                                setStep(1);
                                setVerificationCode('');
                                setError('');
                            }}
                            className="text-gray-500 hover:text-[#D91517]"
                        >
                            Change Phone Number
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleSendCode}
                            disabled={loading || countdown > 0}
                            className="text-[#D91517] hover:underline disabled:text-gray-400"
                        >
                            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                        </button>
                    </div>
                    
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full bg-white border border-gray-300 text-gray-700 py-3 transition-colors duration-200"
                    >
                        Skip for Now
                    </button>
                </form>
            )}
        </div>
    );
};

export default PhoneVerification;