import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '@assets/svg/social/google-icon.svg';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add your signup logic here
    };

    const handleGoogleSignUp = () => {
        // Add your Google signup logic here
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="relative z-20 bg-transparent bg-opacity-90 p-6 rounded-lg max-w-md w-full top-24 lg:top-48 left-1/2 -translate-x-1/2 sm:left-20 sm:translate-x-0 lg:left-32"
            aria-label="Sign Up form"
        >
            <h1 className="text-2xl font-bold mb-6 text-center text-black">Sign Up</h1>
            {error && (
                <p className="mb-4 text-[#ff0000] p-2 rounded" role="alert">
                    {error}
                </p>
            )}

            {/* Name Input */}
            <div className="relative mb-4">
                <input
                    id="name"
                    type="text"
                    className="peer w-full px-3 pt-4 pb-2 border-b border-gray-300 bg-transparent text-black focus:outline-none focus:ring-0 focus:border-[#D91517] transition"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder=" "
                    aria-required="true"
                />
                <label
                    htmlFor="name"
                    className="absolute left-3 top-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[#D91517] peer-focus:text-sm"
                >
                    Full Name
                </label>
            </div>

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

            {/* Confirm Password Input */}
            <div className="relative mb-4">
                <input
                    id="confirmPassword"
                    type="password"
                    className="peer w-full px-3 pt-4 pb-2 border-b border-gray-300 bg-transparent text-black focus:outline-none focus:ring-0 focus:border-[#D91517] transition"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder=" "
                    aria-required="true"
                />
                <label
                    htmlFor="confirmPassword"
                    className="absolute left-3 top-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[#D91517] peer-focus:text-sm"
                >
                    Confirm Password
                </label>
            </div>

            <button
                type="submit"
                className="w-full bg-[#D91517] text-white py-3 transition-colors duration-200 mb-4 hover:bg-white hover:text-[#D91517] border border-[#D91517]"
                disabled={loading}
            >
                {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            <button
                type="button"
                className="w-full bg-white border border-[#D91517] text-black py-3 rounded hover:bg-[#D91517] hover:text-white transition-colors duration-200 flex items-center justify-center space-x-2"
                onClick={handleGoogleSignUp}
            >
                <img src={GoogleIcon} alt="Google Icon" className="w-5 h-5" />
                <span>Sign Up with Google</span>
            </button>
            <p className="mt-4 text-center text-gray-600 text-sm">
                Already have an account?{' '}
                <Link to="/sign-in" className="text-black hover:underline font-semibold">
                    Log In
                </Link>
            </p>
        </form>
    );
};

export default SignUp;