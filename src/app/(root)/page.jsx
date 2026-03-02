import HeroSection from "@/components/HeroSection/HeroSection";
import FeaturedChannels from "@/components/FeaturedChannels/FeaturedChannels";
import TelegramCategories from "@/components/TelegramCategories";
import LatestBlogPosts from "@/components/LatestBlogPosts/LatestBlogPosts";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedChannels />
      <TelegramCategories />
      <LatestBlogPosts />
    </>
  );
}
