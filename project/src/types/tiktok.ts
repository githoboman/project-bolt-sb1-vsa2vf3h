export interface TikTokConfig {
  clientKey: string;
  clientSecret: string;
}

export interface TikTokPost {
  title: string;
  description: string;
  videoFile?: File;
}

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  error: string | null;
}