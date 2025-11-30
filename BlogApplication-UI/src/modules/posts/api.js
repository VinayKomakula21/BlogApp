import { api } from '../app/api/client';

export const postsApi = {
  // Get all posts with pagination and optional tag filter
  getPosts: (page = 0, size = 10, tag = null) => {
    let url = `/Posts?page=${page}&size=${size}`;
    if (tag) {
      url += `&tag=${encodeURIComponent(tag)}`;
    }
    return api.get(url);
  },

  // Search posts
  searchPosts: (query, page = 0, size = 10) =>
    api.get(`/Posts/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`),

  // Get all tags
  getTags: () => api.get('/api/tags'),

  // Get single post by ID
  getPostById: (id) =>
    api.get(`/Posts/${id}`),

  // Get posts by user ID
  getPostsByUser: (userId, page = 0, size = 10) =>
    api.get(`/Posts/user/${userId}?page=${page}&size=${size}`),

  // Create new post
  createPost: (data) => {
    // Handle FormData for image upload
    if (data instanceof FormData) {
      return api.post('/Posts/create', data);
    }
    return api.post('/Posts/create', data);
  },

  // Update post
  updatePost: (id, data) =>
    api.put(`/Posts/${id}`, data),

  // Delete post
  deletePost: (id) =>
    api.delete(`/Posts/${id}`),

  // Like/Unlike post (toggle)
  toggleLike: (postId, username) =>
    api.post(`/Posts/${postId}/like`, { username }),

  // Get likes for a post
  getLikes: (postId) =>
    api.get(`/Posts/${postId}/likes`),

  // Get comments for a post
  getComments: (postId) =>
    api.get(`/Posts/${postId}/comments`),

  // Add comment to a post
  addComment: (postId, data) =>
    api.post(`/Posts/${postId}/comments`, data),

  // Delete comment
  deleteComment: (commentId) =>
    api.delete(`/Comments/${commentId}`),
};
