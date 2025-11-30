import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogCard, Pagination, TagFilter } from "../components";
import { HeroSection } from "../components/HeroSection";
import { postsApi } from "../api";

export const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTag, setActiveTag] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setCurrentPage(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await postsApi.getTags();
        setTags(tagsData || []);
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    fetchTags();
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (debouncedQuery.trim()) {
        data = await postsApi.searchPosts(debouncedQuery, currentPage, pageSize);
      } else {
        data = await postsApi.getPosts(currentPage, pageSize, activeTag);
      }

      const transformedPosts = data.content.map(post => ({
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
        tags: post.tags || [],
      }));

      setPosts(transformedPosts);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedQuery, activeTag]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTagChange = (tagSlug) => {
    setActiveTag(tagSlug);
    setCurrentPage(0);
    setQuery('');
    setDebouncedQuery('');
  };

  // Calculate total posts for "All" tab
  const totalPostsCount = tags.reduce((sum, tag) => sum + (tag.postsCount || 0), 0) || totalElements;

  // Loading state
  if (loading) {
    return (
      <div>
        <HeroSection />
        <div className="container max-w-7xl mx-auto px-4 py-8">
          {/* Tag filter skeleton */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>

          {/* Search skeleton */}
          <div className="flex justify-center mb-8">
            <Skeleton className="h-11 w-full max-w-md" />
          </div>

          {/* Grid skeleton */}
          <div className="grid gap-px bg-border/40 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-background p-4">
                <Skeleton className="aspect-[16/10] w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <HeroSection />
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Posts</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="destructive" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Tag Filter */}
        {tags.length > 0 && (
          <div className="mb-8">
            <TagFilter
              tags={tags}
              activeTag={activeTag}
              onTagChange={handleTagChange}
              totalPosts={totalPostsCount}
            />
          </div>
        )}

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value) {
                  setActiveTag(null);
                }
              }}
              placeholder="Search posts..."
              className="pl-10 h-11 bg-background border-border/40"
            />
          </div>
        </div>

        {/* Results Header */}
        {(debouncedQuery || activeTag) && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {totalElements} {totalElements === 1 ? 'result' : 'results'}
              {debouncedQuery && ` for "${debouncedQuery}"`}
              {activeTag && ` in ${tags.find(t => t.slug === activeTag)?.name || activeTag}`}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('');
                setDebouncedQuery('');
                setActiveTag(null);
              }}
            >
              Clear
            </Button>
          </div>
        )}

        {/* Posts Grid or Empty State */}
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-muted/50 rounded-lg">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            {debouncedQuery || activeTag ? (
              <>
                <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground mb-4">
                  {debouncedQuery ? 'Try a different search term' : 'No posts in this category'}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery('');
                    setDebouncedQuery('');
                    setActiveTag(null);
                  }}
                >
                  Clear Filters
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to share your story!</p>
                <Link to="/create">
                  <Button>Create First Post</Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            {/* 3-Column Grid with Border Effect */}
            <div className="grid gap-px bg-border/40 md:grid-cols-2 lg:grid-cols-3 rounded-lg overflow-hidden border border-border/40">
              {posts.map(post => (
                <div key={post.id} className="bg-background">
                  <BlogCard post={post} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
