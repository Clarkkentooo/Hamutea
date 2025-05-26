import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChineFlatLogo from "@assets/svg/chinese-flat-logo.svg";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:7000/api/verification/verify-email?token=${token}`);
        
        if (response.ok) {
          setStatus("success");
          // Redirect after 3 seconds
          setTimeout(() => {
            navigate("/sign-in?verified=true");
          }, 3000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="bg-white h-screen overflow-hidden relative flex items-center justify-center p-10">
      <div className="absolute top-0 left-0 w-full bg-[#FFEEC3] h-[22.6875rem] overflow-hidden z-0">
        <div className="absolute top-0 right-0 z-0">
          <img src={ChineFlatLogo} alt="" />
        </div>
      </div>

      <div className="w-full bg-white max-w-xl mt-24 z-10 rounded-2xl relative border border-hamutea-border p-10 text-center">
        <h1 className="text-2xl font-bold mb-6">Email Verification</h1>
        
        {status === "verifying" && (
          <div>
            <p className="mb-4">Verifying your email address...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hamutea-red mx-auto"></div>
          </div>
        )}
        
        {status === "success" && (
          <div>
            <p className="mb-4 text-green-600">Your email has been successfully verified!</p>
            <p>You will be redirected to the sign-in page shortly.</p>
          </div>
        )}
        
        {status === "error" && (
          <div>
            <p className="mb-4 text-red-600">There was an error verifying your email.</p>
            <p className="mb-6">The verification link may be invalid or expired.</p>
            <button 
              onClick={() => navigate("/sign-in")}
              className="rounded-full bg-hamutea-red text-white px-5 py-2"
            >
              Go to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;