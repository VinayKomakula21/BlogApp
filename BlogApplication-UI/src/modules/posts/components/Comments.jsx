import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/modules/auth/store";
import { postsApi } from "../api";
import { toast } from "sonner";

export const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const currentUsername = localStorage.getItem('username');

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [postId, showComments]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const commentsData = await postsApi.getComments(postId);
      setComments(commentsData || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info("Please login to comment");
      navigate("/login");
      return;
    }

    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      let username = localStorage.getItem('username');
      if (!username) {
        const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
        username = userInfo.user?.userName || userInfo.userName;
      }
      const commentData = { content: newComment.trim(), username };
      const addedComment = await postsApi.addComment(postId, commentData);
      setComments(prev => [...prev, addedComment]);
      setNewComment('');
      toast.success("Comment added!");
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await postsApi.deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast.success("Comment deleted");
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error("Failed to delete comment");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={() => setShowComments(!showComments)}
          className="gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">
            {showComments ? 'Hide Comments' : `Comments (${comments.length})`}
          </span>
        </Button>
      </div>

      {showComments && (
        <div className="space-y-4">
          <form onSubmit={handleSubmitComment} className="space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!newComment.trim() || submitting}
              >
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {submitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </form>

          {loading ? (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
              <span className="text-gray-500 text-sm">Loading comments...</span>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-4">
              <span className="text-gray-500">No comments yet. Be the first to comment!</span>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {comment.user?.firstName} {comment.user?.lastName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{comment.content}</p>
                    </div>

                    {comment.user?.userName === currentUsername && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="ml-2 text-red-500 hover:text-red-700 h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
