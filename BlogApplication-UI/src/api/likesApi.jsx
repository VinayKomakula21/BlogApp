export const likesApi = {
  // Toggle like/unlike on a post
  toggleLike: async (postId) => {
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`/api/Posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw error;
    }
  },

  // Get likes for a post
  getLikes: async (postId) => {
    try {
      const response = await fetch(`/api/Posts/${postId}/likes`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch likes:', error);
      throw error;
    }
  }
};