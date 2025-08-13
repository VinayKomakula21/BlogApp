
import React from 'react';
import Likes from './Likes';

const Blogcard = ({ post }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className='flex flex-col mt-4 w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
      {/* Image Section */}
      <div className='w-full h-48'>
        <img 
          src={post.image || 'src/assets/download.jpeg'} 
          alt='Blog Illustration' 
          className='w-full h-full object-cover' 
        />
      </div>
      
      {/* Content Section */}
      <div className='flex-1 px-4 py-3'>
        {/* Author and Date */}
        <div className='flex justify-start items-center mb-2'>
          <p className='text-xs text-gray-500'>{post.author}</p>
          <span className='mx-1 text-gray-400'>•</span>
          <p className='text-xs text-gray-500'>{formatDate(post.date)}</p>
        </div>
        
        {/* Title */}
        <h2 className='text-lg font-bold mb-2 text-gray-900 line-clamp-2'>
          {post.title}
        </h2>
        
        {/* Content Preview */}
        <p className='text-gray-600 text-sm mb-3 line-clamp-3'>
          {truncateContent(post.content)}
        </p>
        
        {/* Actions Section */}
        <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
          {/* Likes */}
          <Likes 
            postId={post.id} 
            initialLikes={post.likesCount || 0}
            initialIsLiked={post.isLiked || false}
          />
          
          {/* Read More Button */}
          <button 
            onClick={() => window.location.href = '/blog/' + post.id}
            className='text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors'
          >
            Read More →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blogcard;