
import React from 'react';
import { Link } from 'react-router-dom';
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
      <div className='w-full h-48 bg-gray-100'>
        {post.image ? (
          <img
            src={post.image}
            alt='Blog Illustration'
            className='w-full h-full object-cover'
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-gray-400'>
            <svg className='w-10 h-10' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
              <circle cx='8.5' cy='8.5' r='1.5'></circle>
              <path d='M21 15l-5-5L5 21'></path>
            </svg>
          </div>
        )}
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
          <Link
            to={`/blog/${post.id}`}
            className='text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors'
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Blogcard;