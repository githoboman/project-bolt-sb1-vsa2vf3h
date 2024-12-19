import React from 'react';
import { TikTokButton } from './components/TikTokButton';
import { PostForm } from './components/PostForm';
import { useTikTokAuth } from './hooks/useTikTokAuth';
import { useTikTokPost } from './hooks/useTikTokPost';

/** @jsxImportSource react */


function App() {
  const { isAuthenticated, accessToken, error: authError, isLoading: authLoading, handleAuth, handleCallback } = useTikTokAuth();
  const { isLoading: postLoading, error: postError, handlePost } = useTikTokPost(accessToken);

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    if (code && state) {
      handleCallback(code, state);
    }
  }, [handleCallback]);

  const error = authError || postError;
  const isLoading = authLoading || postLoading;

  return (
    <React.Fragment>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">TikTok AutoPoster</h1>
            <TikTokButton 
              onAuth={handleAuth} 
              isAuthenticated={isAuthenticated} 
              isLoading={isLoading}
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          {isAuthenticated ? (
            <PostForm onSubmit={handlePost} isLoading={isLoading} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Connect your TikTok account to start posting videos automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </React.Fragment>
  );
}

export default App;

