"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isBrowser = typeof window !== "undefined";

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            if (isBrowser){
                localStorage.setItem('token', response.data.token);
            }
            setUser(response.data.user);
            return response.data.user;
        } catch (error) {
            throw error;
        }
    };

    const logout = async() => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            if (isBrowser) {
                localStorage.removeItem('token');
            }
            setUser(null);
        }
    };

    const fetchUser = async () => {
        if(!isBrowser || !localStorage.getItem('token')){
            setLoading(false);
            return;
        }
        try {
            const response = await api.get('/me');
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>{
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}