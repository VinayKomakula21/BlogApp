import React from 'react'

const Blogcard = ( post ) => {
  return (
    <div className='flex justify-between mt-4 w-full bg-white rounded-lg shadow-md py-1.5'>
        <div className='w-1/3  '>
            <img src='src/assets/download.jpeg' alt='Blog Illustration' className='w-full h-auto rounded-l-lg' />
        </div>
        <div className='w-2/3 rounded-lg px-4 py-2'>
            <div className='flex justify-start items-center'>
                <p className='text-[10px] text-gray-400'>{post.author}</p>
                <span className='mx-1 text-gray-400'>•</span>
                <p className='text-[10px] text-gray-400'>{post.date}</p>
            </div>
            <h2 className='text-xl font-bold '>{post.title}</h2>
            <p className='text-gray-600'>{post.content}</p>
            <button 
            onClick={() => window.location.href = '/blog/' + post.id}
            className='mt-2 text-blue-400 text-sm underline hover:text-blue-600 cursor-pointer'>
                Read More
            </button>

        </div>
    </div>
  )
}

export default Blogcard