"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
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
          router.push('/login');
        }
      } else {

        router.push('/login');
      }
    };
    checkToken();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Welcome to Facility Help Desk
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Your one-stop solution for facility management.
        </p>
        <a
          href="/login"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
