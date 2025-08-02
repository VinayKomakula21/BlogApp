import { useState } from 'react'
import { postsApi } from '../api/postsApi'

const CreateBlog = () => {

  const [data, setData] = useState({
    title: '',
    content: '',
    image: null,
  });

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create a New Blog Post</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            required
            className="mt-1 block w-full py-2 px-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter blog title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            value={data.content}
            onChange={(e) => setData({ ...data, content: e.target.value })}
            required
            className="mt-1 block w-full border-gray-300 shadow-sm py-2 px-2 focus:ring-blue-500 focus:border-blue-500"
            rows="6"
            placeholder="Write your blog content here..."
          ></textarea>
        </div>
        
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setData({ ...data, image: e.target.files[0] })}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          placeholder="Upload an image (optional)"
        />


        <button
          type="submit"
          onClick={() => postsApi.createPost(data)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Blog Post
        </button>
      </form>
    </div>
  )
}

export default CreateBlog