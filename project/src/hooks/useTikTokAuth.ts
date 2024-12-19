import { useState, useEffect } from 'react';
import { tiktokAuth } from '../services/tiktokAuth';
import { AuthState } from '../types/tiktok';

export function useTikTokAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    accessToken: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('tiktok_access_token');
    if (accessToken) {
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        accessToken,
      }));
    }
  }, []);

  const handleAuth = async () => {
    try {
      setIsLoading(true);
      const authUrl = await tiktokAuth.getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Authentication failed',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallback = async (code: string, state: string) => {
    try {
      setIsLoading(true);
      const authResult = await tiktokAuth.handleCallback(code, state);
      
      localStorage.setItem('tiktok_access_token', authResult.accessToken);
      localStorage.setItem('tiktok_refresh_token', authResult.refreshToken);
      
      setAuthState({
        isAuthenticated: true,
        accessToken: authResult.accessToken,
        error: null,
      });

      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Authentication failed',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...authState,
    isLoading,
    handleAuth,
    handleCallback,
  };
}