import { z } from 'zod';
import { getEnvVar } from '../utils/env';

const tiktokConfig = {
  clientKey: getEnvVar('VITE_TIKTOK_CLIENT_KEY', z.string()),
  clientSecret: getEnvVar('VITE_TIKTOK_CLIENT_SECRET', z.string()),
  redirectUri: `${getEnvVar('VITE_SITE_URL', z.string().url())}/callback`,
  apiBaseUrl: 'https://open-api.tiktok.com/v2',
  authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
  scope: 'video.upload,video.publish',
  csrfState: crypto.randomUUID()
} as const;

export { tiktokConfig };