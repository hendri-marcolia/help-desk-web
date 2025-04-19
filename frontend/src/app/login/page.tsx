"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
  const router = useRouter();

  const [loginCode, setLoginCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await import('@/api').then(({ AuthService }) =>
            AuthService.getAuthMe()
          );
          if (response) {
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          // Token is invalid, allow login
        }
      }
    };
    checkToken();
  }, [router]);

  const handleLoginCode = async () => {
    console.log('Login with code:', loginCode);
    // TODO: Implement login with code
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await import('@/api').then(({ AuthService }) =>
        AuthService.postAuthLogin({
          requestBody: {
            username,
            password,
          },
        })
      );
      console.log('Login success:', response);
      toast.info("Login success, redirecting to dashboard...");
      localStorage.setItem('token', response.token ?? '');
      localStorage.setItem('refresh_token', response.refresh_token ?? '');
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-100 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
              <span className="text-3xl">💬</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome to Help Desk</h1>
            <p className="mt-1 text-sm text-gray-500">Please sign in to continue</p>
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">Login Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
                placeholder="Enter login code"
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={handleLoginCode}
                disabled={loading}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                  loading
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  'Login with Code'
                )}
              </button>
            </div>
          </div>

          <div className="my-6 border-t"></div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter username"
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <div className="flex gap-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter password"
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
                  </path>
                </svg>
                Loading...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </div>
      </div>
    </>
  );
}
