import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Circle from '@assets/backgroundimage/circle-desktop.svg';
import RedBear from '@assets/backgroundimage/redbear.svg';
import GoogleIcon from '@assets/svg/social/google-icon.svg';


const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
            console.log('Attempting login with:', { email, password });
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/test-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();
            console.log('Login response:', data);
            
            if (data.success) {
                // Store token and user info
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.data));
                
                // Redirect to admin dashboard
                navigate('/admin/dashboard');
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Server error. Please try again later.');
        } finally {
            setLoading(false);
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
                className="w-full bg-white border border-[#D91517] text-black py-3 rounded hover:bg-[#D91517] hover:text-white transition-colors duration-200 flex items-center justify-center space-x-2"
                onClick={() => {
                    // Google sign-in logic here
                }}
            >
                <img src={GoogleIcon} alt="Google Icon" className="w-5 h-5" />
                <span>Log In with Google</span>
            </button>
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