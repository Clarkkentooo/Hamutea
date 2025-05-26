import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const VerifyEmailSuccess = () => {
  useEffect(() => {
    // You could add additional logic here if needed
    // For example, updating the user's verification status in your backend
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-4">Email Verified Successfully!</h1>
        <p className="mb-6">
          Thank you for verifying your email address. Your account is now fully activated.
        </p>
        <Link
          to="/sign-in"
          className="block w-full bg-hamutea-red text-white py-3 rounded-full text-center hover:bg-red-700 transition-colors"
        >
          Sign In to Continue
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailSuccess;