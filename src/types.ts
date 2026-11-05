export interface Review {
  id: string;
  author: string;
  avatarColor: string;
  rating: number;
  date: string;
  device: string;
  content: string;
  helpfulCount: number;
  userVotedHelpful?: boolean;
  developerResponse?: {
    date: string;
    content: string;
  };
}

export interface ScreenshotItem {
  id: string;
  title: string;
  subtitle: string;
  styleTag: string;
  gradient: string;
  accentColor: string;
  beforeLabel: string;
  afterLabel: string;
  imagePromptDescription: string;
  badge: string;
}

export interface AppInfo {
  id: string;
  name: string;
  developer: string;
  developerEmail: string;
  developerWebsite: string;
  developerAddress: string;
  privacyPolicyUrl: string;
  category: string;
  tags: string[];
  rating: number;
  ratingCount: string;
  ratingCountNumber: number;
  downloads: string;
  downloadsNumber: number;
  contentRating: string;
  contentRatingNotes: string[];
  containsAds: boolean;
  inAppPurchases: boolean;
  inAppPriceRange: string;
  version: string;
  updatedDate: string;
  size: string;
  requiredAndroid: string;
  descriptionShort: string;
  descriptionFull: string[];
  whatsNew: string[];
  features: {
    title: string;
    desc: string;
    icon: string;
  }[];
  logoMode?: 'preset' | 'upload' | 'url' | 'custom_icon';
  logoPreset?: 'assai' | 'aimirror' | 'supermarket' | 'shopping' | 'delivery';
  customLogoUrl?: string;
  logoBgColor?: string;
  logoIconSymbol?: 'sun' | 'cart' | 'sparkles' | 'store' | 'package' | 'badge-percent';
  logoBadgeText?: string;
  apkUrl?: string;
  apkFileName?: string;
  apkFileSize?: string;
  apkSourceType?: 'url' | 'upload' | 'default';
  uploadedApkData?: string;
  installButtonText?: string;
  reviews?: Review[];
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'phone' | 'tablet' | 'tv' | 'chromebook' | 'watch';
  model: string;
  carrierOrNetwork: string;
  lastActive: string;
  compatible: boolean;
}
