
'use client';
import { useEffect, useState } from 'react';
import { Data, Session } from '@/utils/Interfaces';
import { notFound } from 'next/navigation';

const useSession = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Add error state

  const fetchUserData = async () => {
    setIsLoading(true); // Set loading to true at the start
    try {
      const { userInfo } = await import('@/utils/FetchFromApi');
      const { currentSession } = await import('@/utils/Session');

      const session = (await currentSession()) as Session;
      if (!session) {
        notFound();
        return null; // Exit if no session
      }

      const currUser = await userInfo(session.user.username);
      setIsAdmin(['admin'].includes(currUser.role));
      
    } catch (err) {
      console.error(err); // Log the error
      setError('Failed to fetch user data.'); // Set error message
    } finally {
      setIsLoading(false); // Set loading to false in finally block
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return { isLoading, isAdmin, error }; // Return error state
};

export default useSession;
