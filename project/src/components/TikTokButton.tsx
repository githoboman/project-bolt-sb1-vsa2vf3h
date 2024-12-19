import React from 'react';
import { Upload, Loader } from 'lucide-react';

interface TikTokButtonProps {
  onAuth: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const TikTokButton: React.FC<TikTokButtonProps> = ({
  onAuth,
  isAuthenticated,
  isLoading,
}) => {
  return (
    <button
      onClick={onAuth}
      disabled={isLoading}
      className="flex items-center gap-2 bg-[#ff0050] hover:bg-[#d6004b] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader className="animate-spin" size={20} />
      ) : (
        <Upload size={20} />
      )}
      {isAuthenticated ? 'Post to TikTok' : 'Connect TikTok'}
    </button>
  );
};