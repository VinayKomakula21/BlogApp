import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { useUIStore } from "@/modules/app/store/ui-store";

export const HeroSection = ({ title = "BlogSphere", subtitle = "Discover amazing stories, insights, and ideas from writers around the world." }) => {
  const { theme } = useUIStore();

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Flickering Grid Background */}
      <div className="absolute inset-0 z-0">
        <FlickeringGrid
          className="h-full w-full"
          squareSize={4}
          gridGap={6}
          color={theme === 'dark' ? 'rgb(148, 163, 184)' : 'rgb(107, 114, 128)'}
          maxOpacity={0.3}
          flickerChance={0.1}
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
