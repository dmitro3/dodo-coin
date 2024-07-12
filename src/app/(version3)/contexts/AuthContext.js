"use client";
import React, { createContext, useState, useEffect, useCallback } from 'react';
import {authenticate} from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUserData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await authenticate();
            setUserData(data);
        } catch (error) {
            console.error('Authentication failed:', error);
            setUserData({
                tronex_balance: '0',
                shib_balance: '0',
                tron_balance: '0',
                power: '0',
                step: '0',
                user: {
                    id: '0'
                }
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    return (
        <AuthContext.Provider value={{userData, setUserData, loading, loadUserData}}>
            {children}
        </AuthContext.Provider>
    );
};