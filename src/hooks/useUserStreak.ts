
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const useUserStreak = () => {
  const { user } = useAuth();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserStreak = async () => {
      if (!user) {
        setCurrentStreak(0);
        setLongestStreak(0);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // TODO: Replace with actual API call to get user's streak data
        // For now, return zero values for new users
        setCurrentStreak(0);
        setLongestStreak(0);
      } catch (error) {
        console.error('Error fetching user streak:', error);
        setCurrentStreak(0);
        setLongestStreak(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStreak();
  }, [user]);

  return { currentStreak, longestStreak, isLoading };
};
