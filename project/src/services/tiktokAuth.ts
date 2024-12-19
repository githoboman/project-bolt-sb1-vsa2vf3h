import { tiktokConfig } from '../config/tiktok.config';

class TikTokAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TikTokAuthError';
  }
}

export const tiktokAuth = {
  async getAuthUrl() {
    try {
      const state = tiktokConfig.csrfState;
      sessionStorage.setItem('tiktok_auth_state', state);
      
      const params = new URLSearchParams({
        client_key: tiktokConfig.clientKey,
        response_type: 'code',
        scope: tiktokConfig.scope,
        redirect_uri: tiktokConfig.redirectUri,
        state,
      });
      
      return `${tiktokConfig.authUrl}?${params.toString()}`;
    } catch (error) {
      throw new TikTokAuthError('Failed to generate auth URL');
    }
  },

  async handleCallback(code: string, state: string) {
    const savedState = sessionStorage.getItem('tiktok_auth_state');
    if (!savedState || savedState !== state) {
      throw new TikTokAuthError('Invalid state parameter');
    }
    
    try {
      const tokenEndpoint = `${tiktokConfig.apiBaseUrl}/oauth/token/`;
      const params = new URLSearchParams({
        client_key: tiktokConfig.clientKey,
        client_secret: tiktokConfig.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: tiktokConfig.redirectUri,
      });

      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new TikTokAuthError(
          errorData.error_description || 'Authentication failed'
        );
      }

      const data = await response.json();
      sessionStorage.removeItem('tiktok_auth_state');
      
      if (data.error) {
        throw new TikTokAuthError(data.error_description || 'Authentication failed');
      }
      
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      };
    } catch (error) {
      if (error instanceof TikTokAuthError) {
        throw error;
      }
      throw new TikTokAuthError('Failed to authenticate with TikTok');
    }
  },

  async refreshToken(refreshToken: string) {
    try {
      const tokenEndpoint = `${tiktokConfig.apiBaseUrl}/oauth/token/`;
      const params = new URLSearchParams({
        client_key: tiktokConfig.clientKey,
        client_secret: tiktokConfig.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      });

      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new TikTokAuthError('Failed to refresh token');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new TikTokAuthError(data.error_description || 'Failed to refresh token');
      }

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      };
    } catch (error) {
      throw new TikTokAuthError('Failed to refresh token');
    }
  }
};