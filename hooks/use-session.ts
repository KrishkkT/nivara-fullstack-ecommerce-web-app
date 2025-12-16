import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Session {
  userId: number;
  email: string;
  fullName: string;
  role: string;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
          // Check for session cookie
          const sessionCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('session='));
          
          if (sessionCookie) {
            // Parse session data from cookie
            const token = sessionCookie.split('=')[1];
            if (token) {
              const sessionData = JSON.parse(atob(token));
              
              // Check if session is still valid
              if (sessionData.expires && new Date(sessionData.expires) > new Date()) {
                setSession({
                  userId: sessionData.userId,
                  email: sessionData.email,
                  fullName: sessionData.fullName,
                  role: sessionData.role,
                });
              } else {
                // Session expired, clear it
                document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                router.push('/login');
              }
            }
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        // If there's an error, redirect to login
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  return { session, loading };
}