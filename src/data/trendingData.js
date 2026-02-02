const images = [
  "https://telegramchannels.me/storage/media-logo/2405/hamster_kombat-thumb.png",
  "https://telegramchannels.me/storage/media-logo/2411/majors-thumb.png",
  "https://telegramchannels.me/storage/media-logo/2405/blumcrypto-thumb.png",
  "https://telegramchannels.me/storage/media-logo/2405/tapswapai-thumb.png",
  "https://telegramchannels.me/storage/media-logo/2112/telegramtips-thumb.png",
];

const baseChannels = [
  { name: "Hamster Kombat", handle: "@hamster_kombat", members: "31.34M", change: "+2.4%", description: "Crypto game and rewards. Join the hamster revolution!", category: "Crypto" },
  { name: "Blum Crypto", handle: "@blumcrypto", members: "21.86M", change: "+1.8%", description: "Tap-to-earn crypto. Grow your digital garden.", category: "Crypto" },
  { name: "Majors", handle: "@majors", members: "17.15M", change: "+0.26%", description: "Gaming and esports updates. Level up with Majors.", category: "Gaming" },
  { name: "TapSwap AI", handle: "@tapswapai", members: "3.2M", change: "+3.1%", description: "AI-powered tap mining. Earn crypto effortlessly.", category: "Crypto" },
  { name: "Telegram Tips", handle: "@telegramtips", members: "2.9M", change: "+0.5%", description: "Tips, tricks and news about Telegram.", category: "News" },
  { name: "Crypto Alpha", handle: "@cryptoalpha", members: "2.5M", change: "+1.2%", description: "Alpha signals and market insights.", category: "Crypto" },
  { name: "Tech Daily", handle: "@techdaily", members: "2.1M", change: "+0.8%", description: "Daily tech news and gadget reviews.", category: "Technology" },
  { name: "Tania Trading", handle: "@taniatrading", members: "1.8M", change: "+1.5%", description: "Forex and trading education.", category: "Finance" },
  { name: "DeFi Updates", handle: "@defiupdates", members: "1.6M", change: "+2.1%", description: "DeFi protocols and yield farming.", category: "Crypto" },
  { name: "NFT Drops", handle: "@nftdrops", members: "1.4M", change: "+0.9%", description: "Latest NFT releases and collections.", category: "Crypto" },
  { name: "Web3 News", handle: "@web3news", members: "1.2M", change: "+1.4%", description: "Blockchain and Web3 headlines.", category: "Crypto" },
  { name: "Startup Hub", handle: "@startuphub", members: "980K", change: "+0.6%", description: "Startup funding and founder stories.", category: "Business" },
];

export const trendingChannels = baseChannels.map((item, i) => ({
  ...item,
  rank: i + 1,
  image: images[i % images.length],
}));
