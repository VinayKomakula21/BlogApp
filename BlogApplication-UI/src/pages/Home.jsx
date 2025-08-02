import React, { useState, useEffect } from 'react'
import Blogcard from '../components/Blogcard';
import { postsApi } from '../api/postsApi';


const Home = () => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await postsApi.getPosts();
                setPosts(data);
                console.log('Fetched posts:', data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

  return (
    <div>
        <div className='max-w-3xl mx-auto pt-6 '>
            <h1 className='text-3xl font-bold mb-4'>Welcome to BlogApp</h1> 
            <p className='text-gray-700'>This is a simple blogging application where you can create, read, and manage your blogs.</p>
            <p className='text-gray-700 mt-4'>Happy Blogging!</p>
            {posts.map(post => (
                <Blogcard 
                    key={post.id}
                    title={post.postTitle}
                    content={post.postContent}
                    author={post.user.firstName + ' ' + post.user.lastName}
                    date={post.createdAt} // Format date to YYYY-MM-DD
                    id={post.id}
                />
            ))}

        </div>
    </div>
  );
};

export default Home;