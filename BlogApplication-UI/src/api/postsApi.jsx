import { fetchWithAuth } from '../utils/axiosConfig';
import tokenStorage from '../utils/tokenStorage';

export const postsApi = {
  getPosts: async () => {
    try {
      const response = await fetchWithAuth('/api/Posts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw error;
    }
  },
  createPost: async (post) => {
    try {
      const preparePostData = async () => {
        const postData = {
          postTitle: post.postTitle || '',
          postContent: post.postContent || '',
          image: null, // default,
          user: post.user || {}
        };
  
        // Convert image to base64 if it's a File
        if (post.image instanceof File) {
          postData.image = await fileToBase64(post.image);
        }
  
        return postData;
      };
  
      const postData = await preparePostData();
  
      const response = await fetchWithAuth('/api/Posts/create', {
        method: 'POST',
        body: JSON.stringify(postData),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  },
    getPostById: async (id) => {
        try {
            const response = await fetchWithAuth(`/api/Posts/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch post:', error);
            throw error;
        }
    }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // reader.result is a base64 data URL
    reader.onerror = reject;
    reader.readAsDataURL(file); // reads file as base64 string
  });
};