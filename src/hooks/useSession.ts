
'use client';
import { useEffect, useState } from 'react';
import { Data, Session, User } from '@/utils/Interfaces';
import { notFound } from 'next/navigation';

const useSession = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null); // Add user data state
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
      setUserData(currUser); // Set user data

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

  return { isLoading, isAdmin, error, user: userData }; // Return error state
};

export default useSession;
