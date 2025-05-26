import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '../../assets/svg/social/google-icon.svg';
import { useAuth } from '../../context/AuthContext';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any field is empty
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            // Import Firebase auth functions
            const { signInWithEmailAndPassword } = await import('firebase/auth');
            const { auth } = await import('../../firebase');
            
            // Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Create user object
            const userData = {
                id: user.uid,
                name: user.displayName || email.split('@')[0],
                email: user.email,
                role: 'user',
                phoneVerified: !!user.phoneNumber,
                emailVerified: user.emailVerified
            };
            
            // Get the ID token
            const token = await user.getIdToken();
            
            // Login the user
            login(userData, token);
            
            // Redirect to home
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                setError('Invalid email or password');
            } else {
                setError('Login failed: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            // Import Firebase auth functions
            const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
            const { auth } = await import('../../firebase');
            
            // Create Google provider
            const googleProvider = new GoogleAuthProvider();
            
            // Sign in with Google using popup
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Create user object
            const userData = {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                role: 'user',
                phoneVerified: !!user.phoneNumber,
                emailVerified: user.emailVerified
            };
            
            // Get the ID token
            const token = await user.getIdToken();
            
            // Login the user
            login(userData, token);
            
            // Redirect to home
            navigate('/');
        } catch (error) {
            console.error('Google login error:', error);
            setError('Failed to sign in with Google: ' + error.message);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="relative z-20 bg-transparent bg-opacity-90 p-6 rounded-lg max-w-md w-full top-24 lg:top-48 left-1/2 -translate-x-1/2 sm:left-20 sm:translate-x-0 lg:left-32"
            aria-label="Log In form"
        >
            <h1 className="text-2xl font-bold mb-6 text-center text-black">Login</h1>
            {error && (
                <p className="mb-4 text-[#ff0000] p-2 rounded" role="alert">
                    {error}
                </p>
            )}

            {/* Email Input */}
            <div className="relative mb-4">
                <input
                    id="email"
                    type="email"
                    className="peer w-full px-3 pt-4 pb-2 border-b border-gray-300 bg-transparent text-black focus:outline-none focus:ring-0 focus:border-[#D91517] transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder=" "
                    aria-required="true"
                />
                <label
                    htmlFor="email"
                    className="absolute left-3 top-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[#D91517] peer-focus:text-sm"
                >
                    Email address
                </label>
            </div>

            {/* Password Input */}
            <div className="relative mb-4">
                <input
                    id="password"
                    type="password"
                    className="peer w-full px-3 pt-4 pb-2 border-b border-gray-300 bg-transparent text-black focus:outline-none focus:ring-0 focus:border-[#D91517] transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder=" "
                    aria-required="true"
                />
                <label
                    htmlFor="password"
                    className="absolute left-3 top-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[#D91517] peer-focus:text-sm"
                >
                    Password
                </label>
            </div>

            <button
                type="submit"
                className="w-full bg-[#D91517] text-white py-3 transition-colors duration-200 mb-4 hover:bg-white hover:text-[#D91517] border border-[#D91517]"
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Log In'}
            </button>
            
            <button
                type="button"
                className="w-full bg-white border border-[#D91517] text-black py-3 rounded hover:bg-[#D91517] hover:text-white transition-colors duration-200 flex items-center justify-center space-x-2 mb-4"
                onClick={handleGoogleLogin}
            >
                <img src={GoogleIcon} alt="Google Icon" className="w-5 h-5" />
                <span>Log In with Google</span>
            </button>
            
            <div className="mt-4 bg-gray-100 p-3 rounded-md">
                <p className="text-sm text-gray-700 mb-2">For testing purposes:</p>
                <p className="text-xs text-gray-600">Email: test@example.com</p>
                <p className="text-xs text-gray-600">Password: password123</p>
            </div>
            
            <p className="mt-4 text-center text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link to="/sign-up" className="text-black hover:underline font-semibold">
                    Sign Up
                </Link>
            </p>
        </form>
    );
};

export default SignIn;