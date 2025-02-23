'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_Providers/AuthProvider'; 

export default function SignOut() {
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    async function handleSignOut() {
      await signOut();
      router.refresh();
    }
    handleSignOut();
  }, [router, signOut]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <p className="text-xl">Signing out...</p>
    </div>
  );
}
