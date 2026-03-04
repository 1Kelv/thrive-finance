import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useSessionTimeout = (timeoutMinutes: number = 10) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const timeoutRef = useRef<number | null>(null);
  const warningRef = useRef<number | null>(null);

  const resetTimeout = useCallback(() => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    // Don't set timeout if user is not logged in
    if (!user) return;

    // Show warning 1 minute before timeout
    const warningTime = (timeoutMinutes - 1) * 60 * 1000;
    warningRef.current = window.setTimeout(() => {
      const shouldContinue = window.confirm(
        '⏰ Your session will expire in 1 minute due to inactivity. Do you want to continue?'
      );
      
      if (shouldContinue) {
        resetTimeout(); // Reset if user wants to continue
      }
    }, warningTime);

    // Set main timeout
    const timeoutDuration = timeoutMinutes * 60 * 1000;
    timeoutRef.current = window.setTimeout(async () => {
      alert('🔒 Your session has expired due to inactivity. Please sign in again.');
      await signOut();
      navigate('/login');
    }, timeoutDuration);
  }, [timeoutMinutes, user, signOut, navigate]);

  useEffect(() => {
    if (!user) return;

    // Activity events to track
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    // Reset timeout on any activity
    events.forEach(event => {
      window.addEventListener(event, resetTimeout);
    });

    // Initial timeout
    resetTimeout();

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimeout);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
    };
  }, [user, resetTimeout]);
};