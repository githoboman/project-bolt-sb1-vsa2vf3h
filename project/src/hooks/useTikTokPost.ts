import { useState } from 'react';
import { tiktokVideo } from '../services/tiktokVideo';
import type { TikTokPost } from '../types/tiktok';

export function useTikTokPost(accessToken: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePost = async (post: TikTokPost) => {
    if (!accessToken) {
      setError('Not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await tiktokVideo.upload(post, accessToken);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to post content');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handlePost,
  };
}