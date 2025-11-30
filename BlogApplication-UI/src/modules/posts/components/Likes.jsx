import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/modules/auth/store";
import { postsApi } from "../api";
import { toast } from "sonner";

export const Likes = ({ postId, initialLikes = 0, initialIsLiked = false }) => {
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const likesData = await postsApi.getLikes(postId);
        setLikesCount(likesData.count || 0);

        const username = localStorage.getItem('username');
        setIsLiked(likesData.users && likesData.users.includes(username));
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    fetchLikes();
  }, [postId]);

  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to like posts");
      navigate("/login");
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      let username = localStorage.getItem('username');
      if (!username) {
        const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
        username = userInfo.user?.userName || userInfo.userName;
      }
      const result = await postsApi.toggleLike(postId, username);
      setIsLiked(result.isLiked);
      setLikesCount(result.likesCount);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={isLiked ? "destructive" : "outline"}
        size="sm"
        onClick={handleLikeClick}
        disabled={loading}
        className="gap-1"
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        <span>{isLiked ? 'Liked' : 'Like'}</span>
      </Button>
      <span className="text-sm text-gray-500">
        {likesCount} {likesCount === 1 ? 'like' : 'likes'}
      </span>
    </div>
  );
};

export default Likes;
