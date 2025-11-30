import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Likes } from "./Likes";
import { postsApi } from "../api";
import { toast } from "sonner";

export const BlogCard = ({ post, showActions = false, onDelete }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user_info') || '{}');
  const isOwner = currentUser?.id && post.userId && currentUser.id === post.userId;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await postsApi.deletePost(post.id);
      toast.success("Post deleted successfully");
      if (onDelete) {
        onDelete();
      } else {
        window.location.reload();
      }
    } catch (err) {
      toast.error('Failed to delete post: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit/${post.id}`);
  };

  return (
    <Link to={`/blog/${post.id}`} className="group block bg-card">
      <article className="h-full">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[16/10] bg-muted">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ImageIcon className="w-12 h-12" />
            </div>
          )}

          {/* Owner Actions Overlay */}
          {isOwner && (
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleEdit}
                className="h-8 w-8 bg-background/80 backdrop-blur-sm"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleDelete}
                disabled={deleting}
                className="h-8 w-8 bg-background/80 backdrop-blur-sm text-destructive hover:text-destructive"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <Badge key={tag.id || tag.name} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl font-semibold tracking-tight mb-2 line-clamp-2 group-hover:underline underline-offset-4 decoration-2">
            {post.title}
          </h2>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {truncateContent(post.content)}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                to={post.userId ? `/user/${post.userId}` : '#'}
                onClick={(e) => e.stopPropagation()}
                className="font-medium text-foreground hover:underline"
              >
                {post.author}
              </Link>
              <span>·</span>
              <time>{formatDate(post.date)}</time>
            </div>

            <div onClick={(e) => e.preventDefault()}>
              <Likes
                postId={post.id}
                initialLikes={post.likesCount || 0}
                initialIsLiked={post.isLiked || false}
              />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
