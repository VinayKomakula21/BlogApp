
import React, { useState, useEffect } from 'react';
import { likesApi } from '../api/likesApi';

const Likes = ({ postId, initialLikes = 0, initialIsLiked = false }) => {
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch current likes status when component mounts
    const fetchLikes = async () => {
      try {
        const likesData = await likesApi.getLikes(postId);
        setLikesCount(likesData.count || 0);
        
        // Check if current user has liked this post
        const username = localStorage.getItem('username');
        setIsLiked(likesData.users && likesData.users.includes(username));
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    fetchLikes();
  }, [postId]);

  const handleLikeClick = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await likesApi.toggleLike(postId);
      setIsLiked(result.isLiked);
      setLikesCount(result.likesCount);
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update if API call fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLikeClick}
        disabled={loading}
        className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
          isLiked
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <svg
          className={`w-5 h-5 ${isLiked ? 'fill-current' : 'stroke-current'}`}
          viewBox="0 0 24 24"
          fill={isLiked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span className="text-sm font-medium">
          {isLiked ? 'Liked' : 'Like'}
        </span>
      </button>
      <span className="text-sm text-gray-500">
        {likesCount} {likesCount === 1 ? 'like' : 'likes'}
      </span>
    </div>
  );
};

export default Likes;