import { cn } from "@/lib/utils";

export const TagFilter = ({ tags = [], activeTag, onTagChange, totalPosts = 0 }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 justify-center">
      {/* All Posts Button */}
      <button
        onClick={() => onTagChange(null)}
        className={cn(
          "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors",
          "border border-border/60 hover:bg-accent",
          activeTag === null
            ? "bg-foreground text-background border-foreground"
            : "bg-background text-foreground"
        )}
      >
        All
        <span
          className={cn(
            "text-xs px-1.5 py-0.5 rounded-full",
            activeTag === null
              ? "bg-background/20 text-background"
              : "bg-muted text-muted-foreground"
          )}
        >
          {totalPosts}
        </span>
      </button>

      {/* Tag Buttons */}
      {tags.map((tag) => (
        <button
          key={tag.id || tag.slug}
          onClick={() => onTagChange(tag.slug)}
          className={cn(
            "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors",
            "border border-border/60 hover:bg-accent",
            activeTag === tag.slug
              ? "bg-foreground text-background border-foreground"
              : "bg-background text-foreground"
          )}
        >
          {tag.name}
          <span
            className={cn(
              "text-xs px-1.5 py-0.5 rounded-full",
              activeTag === tag.slug
                ? "bg-background/20 text-background"
                : "bg-muted text-muted-foreground"
            )}
          >
            {tag.postsCount}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TagFilter;
