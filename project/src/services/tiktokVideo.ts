import { tiktokConfig } from '../config/tiktok.config';
import { TikTokPost } from '../types/tiktok';

export class TikTokVideoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TikTokVideoError';
  }
}

export const tiktokVideo = {
  async upload(post: TikTokPost, accessToken: string) {
    try {
      // Step 1: Create video upload
      const createResponse = await fetch(`${tiktokConfig.apiBaseUrl}/video/upload/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_info: {
            source: 'FILE_UPLOAD',
            video_size: post.videoFile?.size,
            chunk_size: post.videoFile?.size,
          },
        }),
      });

      if (!createResponse.ok) {
        const error = await createResponse.json();
        throw new TikTokVideoError(error.error?.message || 'Failed to initialize upload');
      }

      const { data: { upload_url } } = await createResponse.json();

      // Step 2: Upload video
      if (!post.videoFile) {
        throw new TikTokVideoError('No video file provided');
      }

      const uploadResponse = await fetch(upload_url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': post.videoFile.size.toString(),
        },
        body: post.videoFile,
      });

      if (!uploadResponse.ok) {
        throw new TikTokVideoError('Failed to upload video');
      }

      // Step 3: Publish video
      const publishResponse = await fetch(`${tiktokConfig.apiBaseUrl}/video/publish/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_id: uploadResponse.headers.get('video_id'),
          title: post.title,
          description: post.description,
          privacy_level: 'PUBLIC',
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
        }),
      });

      if (!publishResponse.ok) {
        const error = await publishResponse.json();
        throw new TikTokVideoError(error.error?.message || 'Failed to publish video');
      }

      return await publishResponse.json();
    } catch (error) {
      if (error instanceof TikTokVideoError) {
        throw error;
      }
      throw new TikTokVideoError('Failed to process video upload');
    }
  },
};