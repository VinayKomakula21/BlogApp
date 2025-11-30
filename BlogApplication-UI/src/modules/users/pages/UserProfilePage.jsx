import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlogCard, Pagination } from "@/modules/posts/components";
import { usersApi } from "../api";
import { postsApi } from "@/modules/posts/api";

export const UserProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchProfileAndPosts();
  }, [id, currentPage]);

  const fetchProfileAndPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const profileData = await usersApi.getUserProfile(id);
      setProfile(profileData);

      const postsData = await postsApi.getPostsByUser(id, currentPage, 5);
      const transformedPosts = postsData.content.map(post => ({
        id: post.id,
        title: post.postTitle,
        content: post.postContent,
        author: `${post.user.firstName} ${post.user.lastName}`,
        date: post.createdAt,
        image: post.image,
        likesCount: post.likesCount || 0,
        isLiked: post.isLiked || false,
        commentsCount: post.commentsCount || 0,
        userId: post.user.id,
      }));
      setPosts(transformedPosts);
      setTotalPages(postsData.totalPages);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">User Not Found</h2>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24 text-3xl">
              <AvatarImage src={profile.avatarUrl} alt={profile.firstName} />
              <AvatarFallback className="bg-blue-500 text-white">
                {profile.firstName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">@{profile.userName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Member since {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{profile.postsCount}</p>
              <p className="text-gray-600 dark:text-gray-400">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{profile.commentsCount}</p>
              <p className="text-gray-600 dark:text-gray-400">Comments</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{profile.likesCount}</p>
              <p className="text-gray-600 dark:text-gray-400">Likes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User's Posts */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Posts by {profile.firstName} ({profile.postsCount})
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Posts Yet</h3>
            <p className="text-gray-500 dark:text-gray-400">This user hasn't published any posts yet.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {posts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Back Link */}
      <div className="text-center py-4">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to All Posts
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UserProfilePage;
