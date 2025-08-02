import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BlogDetail = () => {
  useParams();
  const { id } = useParams();
  const [post, setPost] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/Posts/${id}`);
        setLoading(false);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setError(error);
        setLoading(false);
      }
    };
    fetchPost();
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        {post && (
          <>
            <h1 className="text-3xl font-bold mb-4">{post.postTitle}</h1>
            <p className="text-gray-700 mb-4">{post.postContent}</p>
            <p className="text-gray-500 text-sm">
              By {post.user.firstName} {post.user.lastName} on{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            {post.image && (
              <img
                src={post.image}
                alt={post.postTitle}
                className="mt-4 rounded-md"
              />
            )}
          </>
        )}
        {!post && !loading && <p className="text-red-500">Post not found.</p>}
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
      </div>
    </div>
  );
};

export default BlogDetail;
