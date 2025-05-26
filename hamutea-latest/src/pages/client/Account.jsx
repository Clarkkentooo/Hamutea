import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase';
import { updateProfile } from 'firebase/auth';
import { sendEmailVerification } from 'firebase/auth';
import ChineFlatLogo from "../../assets/svg/chinese-flat-logo.svg";
import Profile from "../../assets/svg/profile.svg";
import api from '../../utils/api';

const Account = () => {
    const { currentUser, logout, updateUser } = useAuth();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        birthDate: ''
    });
    const [originalData, setOriginalData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationSent, setVerificationSent] = useState(false);
    const [verificationError, setVerificationError] = useState('');
    const [showPhoneVerification, setShowPhoneVerification] = useState(false);
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (currentUser) {
            const data = {
                name: currentUser.name || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                birthDate: currentUser.birthDate || ''
            };
            setUserData(data);
            setOriginalData(data);
        }
    }, [currentUser]);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        const fieldMap = {
            'full_name': 'name',
            'email': 'email',
            'phone_number': 'phone',
            'birth_date': 'birthDate'
        };
        
        const field = fieldMap[id];
        if (field) {
            setUserData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSave = async () => {
        try {
            // Check if email has changed
            if (userData.email !== originalData.email) {
                setShowEmailVerification(true);
                return;
            }
            
            // Check if phone has changed
            if (userData.phone !== originalData.phone) {
                setShowPhoneVerification(true);
                return;
            }
            
            // Update profile
            const user = auth.currentUser;
            if (user) {
                await updateProfile(user, {
                    displayName: userData.name
                });
                
                // Update user data in database
                const token = await user.getIdToken();
                await api.put('/users/profile', {
                    name: userData.name,
                    birthDate: userData.birthDate
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                // Update context
                updateUser({
                    ...currentUser,
                    name: userData.name,
                    birthDate: userData.birthDate
                });
                
                setOriginalData(userData);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setVerificationError('Failed to update profile. Please try again.');
        }
    };

    const handleSignOut = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleSendPhoneCode = async () => {
        try {
            setIsVerifying(true);
            setVerificationError('');
            
            // Send verification code to phone
            const token = await auth.currentUser.getIdToken();
            await api.post('/verification/phone', {
                phone: userData.phone
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setVerificationSent(true);
            setCountdown(60); // 60 seconds cooldown
        } catch (error) {
            console.error('Error sending verification code:', error);
            setVerificationError('Failed to send verification code. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleVerifyPhone = async () => {
        try {
            setIsVerifying(true);
            setVerificationError('');
            
            // Verify phone code
            const token = await auth.currentUser.getIdToken();
            await api.post('/verification/phone/verify', {
                phone: userData.phone,
                code: verificationCode
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Update user data
            updateUser({
                ...currentUser,
                phone: userData.phone,
                phoneVerified: true
            });
            
            setOriginalData(prev => ({ ...prev, phone: userData.phone }));
            setShowPhoneVerification(false);
            setIsEditing(false);
        } catch (error) {
            console.error('Error verifying phone:', error);
            setVerificationError('Invalid verification code. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSendEmailVerification = async () => {
        try {
            setIsVerifying(true);
            setVerificationError('');
            
            // Send email verification
            const user = auth.currentUser;
            await sendEmailVerification(user);
            
            // Update email in database
            const token = await user.getIdToken();
            await api.put('/users/profile', {
                email: userData.email
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Update context
            updateUser({
                ...currentUser,
                email: userData.email,
                emailVerified: false
            });
            
            setOriginalData(prev => ({ ...prev, email: userData.email }));
            setShowEmailVerification(false);
            setIsEditing(false);
        } catch (error) {
            console.error('Error sending email verification:', error);
            setVerificationError('Failed to send verification email. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    // Phone verification modal
    const renderPhoneVerification = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Verify Your Phone Number</h2>
                <p className="mb-4">We need to verify your phone number: <strong>{userData.phone}</strong></p>
                
                {verificationError && <p className="text-red-500 mb-4">{verificationError}</p>}
                
                {!verificationSent ? (
                    <div className="flex justify-between">
                        <button
                            onClick={handleSendPhoneCode}
                            disabled={isVerifying}
                            className="bg-hamutea-red text-white px-4 py-2 rounded-full disabled:opacity-50"
                        >
                            {isVerifying ? "Sending..." : "Send Verification Code"}
                        </button>
                        
                        <button
                            onClick={() => {
                                setShowPhoneVerification(false);
                                setUserData(prev => ({...prev, phone: originalData.phone}));
                            }}
                            className="text-gray-500 underline"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleVerifyPhone(); }}>
                        <div className="mb-4">
                            <label htmlFor="verification_code" className="block text-sm font-medium text-gray-700 mb-1">
                                Enter Verification Code
                            </label>
                            <input
                                type="text"
                                id="verification_code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <button
                                type="submit"
                                disabled={isVerifying || !verificationCode}
                                className="bg-hamutea-red text-white px-4 py-2 rounded-full disabled:opacity-50"
                            >
                                {isVerifying ? "Verifying..." : "Verify Code"}
                            </button>
                            
                            <button
                                type="button"
                                onClick={handleSendPhoneCode}
                                disabled={isVerifying || countdown > 0}
                                className="text-hamutea-red px-4 py-2 disabled:opacity-50"
                            >
                                {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                            </button>
                        </div>
                    </form>
                )}
                
                <div className="mt-4 text-center">
                    <button
                        onClick={() => {
                            setShowPhoneVerification(false);
                            setUserData(prev => ({...prev, phone: originalData.phone}));
                            setVerificationCode("");
                            setVerificationSent(false);
                        }}
                        className="text-gray-500 underline"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
    
    // Email verification modal
    const renderEmailVerification = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Verify Your Email Address</h2>
                <p className="mb-4">We need to verify your email address: <strong>{userData.email}</strong></p>
                <p className="mb-4">Click the button below to receive a verification link via email.</p>
                
                {verificationError && <p className="text-red-500 mb-4">{verificationError}</p>}
                
                <div className="flex justify-between">
                    <button
                        onClick={handleSendEmailVerification}
                        disabled={isVerifying}
                        className="bg-hamutea-red text-white px-4 py-2 rounded-full disabled:opacity-50"
                    >
                        {isVerifying ? "Sending..." : "Send Verification Email"}
                    </button>
                    
                    <button
                        onClick={() => {
                            setShowEmailVerification(false);
                            setUserData(prev => ({...prev, email: originalData.email}));
                        }}
                        className="text-gray-500 underline"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white h-screen overflow-hidden relative flex items-center justify-center p-10">
            <div className="absolute top-0 left-0 w-full bg-[#FFEEC3] h-[22.6875rem] overflow-hidden z-0">
                <div className="absolute top-0 right-0 z-0">
                    <img src={ChineFlatLogo} alt="" />
                </div>
            </div>

            <div className="w-full bg-white max-w-xl mt-24 z-10 rounded-2xl relative border border-hamutea-border p-10">
                <div className="absolute -top-10 transform -translate-x-1/2 left-1/2 z-0">
                    <img src={Profile} alt="" className="h-28 w-h-28 rounded-full" />
                </div>

                <div className="flex justify-end w-full">
                    {isEditing ? (
                        <button 
                            className="rounded-full bg-hamutea-red text-white px-5 py-2"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    ) : (
                        <button 
                            className="rounded-full bg-[#fafafa] px-5 py-2 border-2 border-hamutea-border"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Info
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-center flex-col">
                    <h1 className="text-2xl font-bold">{userData.name}</h1>
                    <p>{userData.email}</p>
                    {currentUser?.emailVerified === false && (
                        <p className="text-sm text-red-500 mt-1">Email not verified</p>
                    )}
                </div>

                <div className="flex flex-col gap-5 mt-10">
                    <div className="flex border-b border-hamutea-border pb-2">
                        <label htmlFor="full_name" className="text-hamutea-gray">Full Name</label>
                        <input 
                            type="text" 
                            id="full_name" 
                            value={userData.name}
                            onChange={handleChange}
                            className="ml-5 flex-1 appearance-none border-none outline-none bg-transparent m-0 shadow-none focus:outline-none" 
                            readOnly={!isEditing}
                            disabled={!isEditing}
                        />
                    </div>
                    
                    <div className="flex border-b border-hamutea-border pb-2">
                        <label htmlFor="email" className="text-hamutea-gray">Email</label>
                        <div className="ml-5 flex-1 flex items-center">
                            <input 
                                type="email" 
                                id="email" 
                                value={userData.email}
                                onChange={handleChange}
                                className="flex-1 appearance-none border-none outline-none bg-transparent m-0 shadow-none focus:outline-none" 
                                readOnly={!isEditing}
                                disabled={!isEditing}
                            />
                            {currentUser?.emailVerified && (
                                <span className="text-green-500 text-sm ml-2">✓ Verified</span>
                            )}
                        </div>
                    </div>

                    <div className="flex border-b border-hamutea-border pb-2">
                        <label htmlFor="phone_number" className="text-hamutea-gray">Phone Number</label>
                        <div className="ml-5 flex-1 flex items-center">
                            <input 
                                type="text" 
                                id="phone_number" 
                                value={userData.phone}
                                onChange={handleChange}
                                className="flex-1 appearance-none border-none outline-none bg-transparent m-0 shadow-none focus:outline-none" 
                                readOnly={!isEditing}
                                disabled={!isEditing}
                            />
                            {currentUser?.phoneVerified && (
                                <span className="text-green-500 text-sm ml-2">✓ Verified</span>
                            )}
                        </div>
                    </div>

                    <div className="flex border-b border-hamutea-border pb-2">
                        <label htmlFor="birth_date" className="text-hamutea-gray">Birth Date</label>
                        <input 
                            type="text" 
                            id="birth_date" 
                            value={userData.birthDate}
                            onChange={handleChange}
                            className="ml-5 flex-1 appearance-none border-none outline-none bg-transparent m-0 shadow-none focus:outline-none" 
                            readOnly={!isEditing}
                            disabled={!isEditing}
                            placeholder="YYYY-MM-DD"
                        />
                    </div>
                </div>

                <div className="flex justify-center w-full mt-10">
                    <button 
                        className="rounded-full bg-[#fadcdc] px-5 py-2 border-2 border-hamutea-red text-hamutea-red"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
            
            {showPhoneVerification && renderPhoneVerification()}
            {showEmailVerification && renderEmailVerification()}
        </div>
    );
}

export default Account;