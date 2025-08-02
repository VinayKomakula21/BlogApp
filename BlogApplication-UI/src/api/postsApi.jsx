export const postsApi = {
  getPosts: async () => {
    try {
      const response = await fetch('/api/Posts');
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
        const response = await fetch('/api/Posts/create', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: post,
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
        } catch (error) {
        console.error('Failed to create post:', error);
        throw error;
        }
    }, 
    getPostById: async (id) => {
        try {
            const response = await fetch(`/api/Posts/${id}`);
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