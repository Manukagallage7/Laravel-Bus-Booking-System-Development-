"use client";
import React from 'react';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

export default function Login() {

    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');


        if(!email || !password){
            setError('Email and password are required');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err) {
            setError('Failed to login');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            <div className='w-full max-w-md bg-white p-6 rounded-lg shadow-gray-50'>
                <h1 className='text-2xl font-semibold text-center mb-6'>Login</h1>

                {error && (
                    <p className='mb-4 text-sm text-red-600'>{error}</p>
                )}

                <div className='space-y-4'>
                    <input
                        type='email'
                        placeholder='Email'
                        className='w-full border rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        className='w-full border rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50'
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
                <p className='text-sm text-center mt-4'>
                    {"Don't have an account?"}
                    <Link href='/auth/register'
                        className='text-blue-500 hover:underline'>Register
                    </Link>
                </p>
            </div>
        </div>
    )
}