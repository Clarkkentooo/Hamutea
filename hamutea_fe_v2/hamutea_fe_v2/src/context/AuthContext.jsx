import { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in
                try {
                    // Get the ID token
                    const token = await user.getIdToken();
                    
                    // Create user object
                    const userData = {
                        id: user.uid,
                        name: user.displayName || user.email.split('@')[0],
                        email: user.email,
                        role: 'user',
                        phoneVerified: !!user.phoneNumber,
                        emailVerified: user.emailVerified
                    };
                    
                    // Store user data
                    localStorage.setItem('adminToken', token);
                    localStorage.setItem('adminUser', JSON.stringify(userData));
                    setCurrentUser(userData);
                } catch (error) {
                    console.error('Error getting user data:', error);
                }
            } else {
                // User is signed out
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                setCurrentUser(null);
            }
            
            setLoading(false);
        });
        
        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        setCurrentUser(userData);
    };

    const logout = async () => {
        try {
            await auth.signOut();
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            setCurrentUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const updateUser = (userData) => {
        localStorage.setItem('adminUser', JSON.stringify(userData));
        setCurrentUser(userData);
    };

    return (
        <AuthContext.Provider value={{ 
            currentUser, 
            login, 
            logout, 
            updateUser,
            isAuthenticated: !!currentUser,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};