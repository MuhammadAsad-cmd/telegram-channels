import FeaturedChannels from "@/components/FeaturedChannels/FeaturedChannels";
import HeroSection from "@/components/HeroSection/HeroSection";
import LatestBlogPosts from "@/components/LatestBlogPosts/LatestBlogPosts";
import TelegramCategories from "@/components/TelegramCategories";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedChannels
        filter="all"
        title="Featured Channels"
        subtitle="Discover the most popular Telegram channels"
        showFeaturedBadge
        sectionVariant="dark"
        cardVariant="dark"
      />
      <FeaturedChannels
        filter="home"
        title="All Channels"
        subtitle="Channels selected for the homepage"
        showFeaturedBadge={false}
        sectionVariant="dark"
        cardVariant="dark"
      />
      <TelegramCategories />
      <LatestBlogPosts />
    </>
  );
}
