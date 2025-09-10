// AuthProvider.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;
    const isAdmin = user ? user.isAdmin : false;

    const fetchAuth = useCallback(async () => {

        const response = await fetch(`http://13.48.125.242:8000/api/authme`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            },
          });

        if (!response.ok) {
            if (response.status === 401) {
                console.warn("401 Unauthorized: Token likely expired or invalid.");
            }
            const errorData = await response.json().catch(() => ({ message: 'Something went wrong!' }));
            throw new Error(errorData.message || 'API request failed');
        }

        return response.json();
    }, []);

    const checkAuthStatus = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwt_token');

            if (token) {
                const responseData = await fetchAuth();
                setUser(responseData.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to check auth status or token expired:", error);
            localStorage.removeItem('jwt_token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [fetchAuth]);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = async (userEmail, password) => {
        setLoading(true);
        try {
            const response = await fetch(`http://13.48.125.242:8000/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail, password }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed!');
            }
    
            const responseData = await response.json();
            const { token, user: userData } = responseData;
    
            localStorage.setItem('jwt_token', token);
            setUser(userData);
            return true;
        } catch (error) {
            console.error('Login failed:', error.message);
            setUser(null);
            localStorage.removeItem('jwt_token');
            throw error; // Throw the error to be caught in LoginPage
        } finally {
            setLoading(false);
        }
    };

    const logout = useCallback(() => {
        localStorage.removeItem('jwt_token');
        setUser(null);
    }, []);

    const value = {
        user,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        logout,
        fetchAuth,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};