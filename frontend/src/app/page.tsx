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

}
