import api from "@/lib/axios";

export const tagsApi = {
  getTags: async () => {
    const response = await api.get('/api/tags');
    return response.data;
  },

  getTagBySlug: async (slug) => {
    const response = await api.get(`/api/tags/${slug}`);
    return response.data;
  },

  createTag: async (name) => {
    const response = await api.post('/api/tags', { name });
    return response.data;
  },
};

export default tagsApi;
