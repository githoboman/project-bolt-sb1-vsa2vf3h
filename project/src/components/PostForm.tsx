import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import type { TikTokPost } from '../types/tiktok';

interface PostFormProps {
  onSubmit: (post: TikTokPost) => void;
  isLoading: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) return;
    
    onSubmit({
      title,
      description,
      videoFile,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          rows={3}
          required
        />
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {!videoFile ? (
          <div className="space-y-2">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="text-sm text-gray-600">
              <label className="cursor-pointer text-pink-600 hover:text-pink-500">
                Upload a video
                <input
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{videoFile.name}</span>
            <button
              type="button"
              onClick={() => setVideoFile(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !videoFile}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff0050] hover:bg-[#d6004b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Posting...' : 'Post to TikTok'}
      </button>
    </form>
  );
};