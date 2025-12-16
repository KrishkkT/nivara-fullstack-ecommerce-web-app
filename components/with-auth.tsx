"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/use-session';

interface WithAuthProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function withAuth(Component: React.ComponentType<any>, requiredRole?: string) {
  return function WithAuthWrapper(props: any) {
    const router = useRouter();
    const { session, loading } = useSession();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      if (!loading) {
        if (!session) {
          // No session, redirect to login
          router.push('/login');
        } else if (requiredRole && session.role !== requiredRole) {
          // Role mismatch, redirect to appropriate page
          if (session.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        } else {
          // Authorized
          setIsAuthorized(true);
        }
      }
    }, [session, loading, router]);

    if (loading || !isAuthorized) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    return <Component {...props} session={session} />;
  };
}