import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { User, Calendar, ArrowLeft, AlertCircle, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Likes, Comments } from "../components";
import { postsApi } from "../api";
import { toast } from "sonner";

export const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user_info') || '{}');
  const isOwner = currentUser?.id && post?.user?.id && currentUser.id === post.user.id;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await postsApi.getPostById(id);
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await postsApi.deletePost(id);
      toast.success("Post deleted successfully");
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete post: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Skeleton className="w-full aspect-[16/9] mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Post</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="destructive" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!post) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Post Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested blog post could not be found.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <article className="container max-w-3xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to posts
      </Button>

      {/* Featured Image */}
      {post.image && (
        <div className="w-full aspect-[16/9] mb-8 rounded-lg overflow-hidden bg-muted">
          <img
            src={post.image}
            alt={post.postTitle}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <Badge key={tag.id || tag.name} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-6">
        {post.postTitle}
      </h1>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
        <Link
          to={`/user/${post.user.id}`}
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <User className="w-4 h-4" />
          <span className="font-medium">{post.user.firstName} {post.user.lastName}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <time>{formatDate(post.createdAt)}</time>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="flex items-center gap-2 ml-auto">
            <Link to={`/edit/${post.id}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        )}
      </div>

      <Separator className="mb-8" />

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
        <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {post.postContent}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Likes & Comments */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Likes
            postId={post.id}
            initialLikes={post.likesCount || 0}
            initialIsLiked={post.isLiked || false}
          />
        </div>

        <Comments postId={post.id} />
      </div>
    </article>
  );
};

export default BlogDetailPage;
