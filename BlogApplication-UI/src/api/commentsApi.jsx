export const commentsApi = {
  // Get comments for a post
  getComments: async (postId) => {
    try {
      const response = await fetch(`/api/Posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      throw error;
    }
  },

  // Add a comment to a post
  addComment: async (postId, commentData) => {
    try {
      const userName = localStorage.getItem('username');
      const response = await fetch(`/api/Posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...commentData,
          userName
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    try {
      const response = await fetch(`/api/Comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    } catch (error) {
      console.error('Failed to delete comment:', error);
      throw error;
    }
  }
};