// Types for Almost Archive - Story submission and archive system

// ===== CORE STORY TYPES =====

export interface Story {
  id: string;
  title: string;
  body: string;
  authorName?: string; // Optional or alias
  dateOfMemory?: string; // Optional date when the memory happened
  dateSubmitted: string; // ISO string of when submitted
  tags: string[]; // Array of tags like ["first love", "cheated", "closure"]
  mood: Mood;
  reactions: StoryReactions;
  reactionCount?: number; // Total likes/reactions count
  readCount: number;
  isPublished: boolean;
  slug: string; // URL-friendly version of title for routing
}

export interface StoryPreview {
  id: string;
  title: string;
  preview: string; // First ~150 characters of the story body
  authorName?: string;
  dateSubmitted: string;
  tags: string[];
  mood: Mood;
  reactions: StoryReactions;
  readCount: number;
  slug: string;
}

export interface StorySubmission {
  title: string;
  body: string;
  authorName?: string;
  dateOfMemory?: string;
  tags: string[];
  mood: Mood;
}

// ===== MOOD SYSTEM =====

export type MoodType = 
  | 'heartbroken' 
  | 'angry' 
  | 'nostalgic' 
  | 'hopeful' 
  | 'confused' 
  | 'grateful' 
  | 'regretful'
  | 'peaceful'
  | 'bitter'
  | 'healing';

export interface Mood {
  type: MoodType;
  emoji: string;
  label: string;
  color: string; // CSS color for theming
}

// Predefined mood options
export const MOOD_OPTIONS: Mood[] = [
  { type: 'heartbroken', emoji: '💔', label: 'Heartbroken', color: '#c49484' },
  { type: 'angry', emoji: '😡', label: 'Angry', color: '#d4756b' },
  { type: 'nostalgic', emoji: '🌅', label: 'Nostalgic', color: '#d4a574' },
  { type: 'hopeful', emoji: '🌱', label: 'Hopeful', color: '#a8c49e' },
  { type: 'confused', emoji: '😵‍💫', label: 'Confused', color: '#ab8a6e' },
  { type: 'grateful', emoji: '🙏', label: 'Grateful', color: '#8b9f52' },
  { type: 'regretful', emoji: '😔', label: 'Regretful', color: '#8b6f52' },
  { type: 'peaceful', emoji: '☁️', label: 'At Peace', color: '#9eb4c4' },
  { type: 'bitter', emoji: '🥀', label: 'Bitter', color: '#7d5a47' },
  { type: 'healing', emoji: '✨', label: 'Healing', color: '#b4a8c4' }
];

// ===== REACTION SYSTEM =====

export type ReactionType = 'heartbroken' | 'lol' | 'hug' | 'ex-sucks';

export interface Reaction {
  type: ReactionType;
  emoji: string;
  label: string;
  description: string;
}

export const REACTION_OPTIONS: Reaction[] = [
  { 
    type: 'heartbroken', 
    emoji: '💔', 
    label: 'Heartbroken', 
    description: 'This broke my heart too' 
  },
  { 
    type: 'lol', 
    emoji: '😆', 
    label: 'LOL', 
    description: 'This made me laugh' 
  },
  { 
    type: 'hug', 
    emoji: '🫂', 
    label: 'Hug them', 
    description: 'Sending virtual hugs' 
  },
  { 
    type: 'ex-sucks', 
    emoji: '😡', 
    label: 'That Ex Sucks', 
    description: 'Your ex is terrible' 
  }
];

export interface StoryReactions {
  heartbroken: number;
  lol: number;
  hug: number;
  'ex-sucks': number;
  total: number;
}

export interface UserReaction {
  storyId: string;
  reactionType: ReactionType;
  timestamp: string;
  userFingerprint: string; // Anonymous user identification
}

// ===== COMMENT SYSTEM =====

export interface Comment {
  id: string;
  storyId: string;
  authorName?: string; // Optional anonymous name
  body: string;
  timestamp: string;
  isSupport: boolean; // True for supportive comments
  reactions: {
    hearts: number;
    hugs: number;
  };
}

export interface CommentSubmission {
  storyId: string;
  authorName?: string;
  body: string;
  isSupport: boolean;
}

// ===== FILTERING AND SORTING =====

export type SortOption = 'newest' | 'oldest' | 'most-read' | 'most-reacted';

export interface FilterOptions {
  tags?: string[];
  moods?: MoodType[];
  searchQuery?: string;
  authorName?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface ArchiveQuery {
  filters?: FilterOptions;
  sort: SortOption;
  pagination: PaginationOptions;
}

export interface ArchiveResult {
  stories: StoryPreview[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ===== SEARCH SYSTEM =====

export interface SearchResult {
  story: StoryPreview;
  matchType: 'title' | 'body' | 'tags' | 'author';
  matchScore: number; // Relevance score
}

export interface SearchQuery {
  query: string;
  filters?: FilterOptions;
  limit?: number;
}

// ===== RELATED STORIES =====

export interface RelatedStory {
  story: StoryPreview;
  relationScore: number; // How related it is (based on tags, mood, etc.)
  relationReason: string; // "Similar mood" | "Same tags" | "Similar theme"
}

// ===== ANALYTICS & STATS =====

export interface SiteStats {
  totalStories: number;
  totalReactions: number;
  totalComments: number;
  popularTags: Array<{ tag: string; count: number }>;
  moodDistribution: Array<{ mood: MoodType; count: number }>;
  storiesThisWeek: number;
  storiesThisMonth: number;
}

// ===== FORM VALIDATION =====

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: ValidationError[];
}

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SubmissionResponse {
  storyId: string;
  slug: string;
  message: string;
}

// ===== FIREBASE COLLECTION NAMES =====

export const COLLECTIONS = {
  STORIES: 'stories',
  COMMENTS: 'comments',
  REACTIONS: 'user-reactions',
  SITE_STATS: 'site-stats'
} as const;

// ===== UTILITY TYPES =====

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// For Firebase documents
export type WithFirestoreId<T> = T & { id: string };
export type WithTimestamps<T> = T & { 
  createdAt: string; 
  updatedAt: string; 
};

// ===== CONSTANTS =====

export const CONSTANTS = {
  STORY_PREVIEW_LENGTH: 150,
  MAX_TAGS_PER_STORY: 5,
  MAX_TITLE_LENGTH: 100,
  MAX_BODY_LENGTH: 5000,
  MAX_COMMENT_LENGTH: 500,
  STORIES_PER_PAGE: 12,
  RELATED_STORIES_COUNT: 3,
  POPULAR_TAGS_COUNT: 10
} as const;

// ===== FIREBASE COLLECTIONS DOCUMENTATION =====

/*
FIREBASE COLLECTIONS STRUCTURE:

📦 stories/
   └── {storyId} (document)
       ├── id: string
       ├── title: string
       ├── body: string (full story content)
       ├── authorName?: string (optional alias)
       ├── dateOfMemory?: string (when the memory happened)
       ├── dateSubmitted: string (ISO timestamp)
       ├── tags: string[] (array of tags)
       ├── mood: Mood object (type, emoji, label, color)
       ├── reactions: StoryReactions (heartbroken, lol, hug, ex-sucks counts + total)
       ├── readCount: number
       ├── isPublished: boolean
       ├── slug: string (URL-friendly version)
       ├── createdAt: string (Firestore timestamp)
       └── updatedAt: string (Firestore timestamp)

📦 comments/
   └── {commentId} (document)
       ├── id: string
       ├── storyId: string (reference to parent story)
       ├── authorName?: string (optional anonymous name)
       ├── body: string (comment content)
       ├── timestamp: string (ISO timestamp)
       ├── isSupport: boolean (supportive vs general comment)
       ├── reactions: { hearts: number, hugs: number }
       ├── createdAt: string (Firestore timestamp)
       └── updatedAt: string (Firestore timestamp)

📦 user-reactions/
   └── {reactionId} (document)
       ├── storyId: string (reference to story)
       ├── reactionType: ReactionType ('heartbroken' | 'lol' | 'hug' | 'ex-sucks')
       ├── timestamp: string (ISO timestamp)
       ├── userFingerprint: string (anonymous user ID - could be IP hash or browser fingerprint)
       ├── createdAt: string (Firestore timestamp)
       └── updatedAt: string (Firestore timestamp)
       
   NOTE: This collection prevents duplicate reactions per user per story
   Query pattern: WHERE storyId == X AND userFingerprint == Y

📦 site-stats/ (single document or periodic snapshots)
   └── current (document) OR {date} for historical stats
       ├── totalStories: number
       ├── totalReactions: number
       ├── totalComments: number
       ├── popularTags: Array<{tag: string, count: number}>
       ├── moodDistribution: Array<{mood: MoodType, count: number}>
       ├── storiesThisWeek: number
       ├── storiesThisMonth: number
       ├── lastUpdated: string (ISO timestamp)
       ├── createdAt: string (Firestore timestamp)
       └── updatedAt: string (Firestore timestamp)

FIRESTORE QUERIES YOU'LL NEED:

🔍 Archive/Feed Queries:
   - stories WHERE isPublished == true ORDER BY dateSubmitted DESC
   - stories WHERE isPublished == true AND mood.type IN [moodFilters]
   - stories WHERE isPublished == true AND tags ARRAY_CONTAINS_ANY [tagFilters]

📊 Popular/Trending:
   - stories ORDER BY reactions.total DESC
   - stories ORDER BY readCount DESC
   - stories WHERE dateSubmitted >= lastWeek ORDER BY reactions.total DESC

🏷️ Tag System:
   - stories WHERE tags ARRAY_CONTAINS 'specific-tag'
   - Aggregate query to count tags for popular tags widget

💬 Comments:
   - comments WHERE storyId == 'story-id' ORDER BY timestamp ASC
   - Count query: comments WHERE storyId == 'story-id'

❤️ Reactions:
   - user-reactions WHERE storyId == 'story-id' AND userFingerprint == 'user-hash'
   - Aggregate reactions by type for each story

🔍 Search:
   - Full-text search will require Algolia or similar service
   - OR client-side filtering of story titles/previews
   - Consider storing searchable text fields in lowercase

SECURITY RULES CONSIDERATIONS:
   - All collections should be publicly readable
   - Stories: only allow creation, not updates (immutable after submission)
   - Comments: allow creation with validation
   - User-reactions: allow creation but check for duplicates
   - Site-stats: admin write only, public read

INDEXES NEEDED:
   - stories: [isPublished, dateSubmitted]
   - stories: [isPublished, reactions.total]
   - stories: [isPublished, readCount]
   - stories: [tags (array), isPublished]
   - stories: [mood.type, isPublished]
   - comments: [storyId, timestamp]
   - user-reactions: [storyId, userFingerprint] (compound for uniqueness)
*/
