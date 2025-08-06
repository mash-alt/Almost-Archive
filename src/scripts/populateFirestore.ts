import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { 
  REACTION_OPTIONS, 
  COLLECTIONS 
} from '../types';

// Load environment variables
config();

// Helper function to create a URL-friendly slug
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Generate user fingerprint (simplified for demo)
function generateFingerprint(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Sample story data - simplified for Firestore compatibility
const sampleStories = [
  {
    title: "The Letter I Never Sent",
    body: "I found it tucked between the pages of my old journal - a love letter I wrote but never had the courage to send. The paper had yellowed with time, and the ink had faded, but every word was still there. 'Dear Sarah,' it began, 'I've been trying to find the right words to tell you how I feel...' Reading it now, five years later, I can't help but wonder what would have happened if I had been brave enough to give it to you. Would we have had those sunset walks we talked about? Would you have said yes when I asked you to stay? I guess I'll never know. But maybe that's okay. Maybe some letters are meant to remain undelivered, living forever in the space between what was and what could have been.",
    authorName: "Anonymous Dreamer",
    dateOfMemory: "2019-03-15",
    dateSubmitted: new Date('2025-08-01').toISOString(),
    tags: ["first love", "regret", "what if"],
    mood: {
      type: 'nostalgic',
      emoji: '',
      label: 'Nostalgic',
      color: '#d4a574'
    },
    reactions: { heartbroken: 12, lol: 0, hug: 8, exSucks: 0, total: 20 },
    readCount: 45,
    isPublished: true,
    slug: createSlug("The Letter I Never Sent")
  },
  {
    title: "When Everything Fell Apart",
    body: "It was a Tuesday when my world collapsed. Not a dramatic Monday or a fateful Friday - just an ordinary Tuesday. I came home to find your bags packed and a note on the kitchen table. 'I can't do this anymore,' it said in your careful handwriting. No explanation, no fight, no chance to fix whatever had broken between us. Just silence and the echo of the door closing behind you. I sat there for hours, holding that note, trying to understand how three years could end with eight words. The worst part? I still don't know what 'this' was. Was it me? Was it us? Was it the life we'd built together? I've been replaying every conversation, every moment, looking for clues I missed. But maybe some endings don't come with explanations. Maybe sometimes people just... leave.",
    authorName: "Broken but Breathing",
    dateOfMemory: "2024-11-12",
    dateSubmitted: new Date('2025-08-02').toISOString(),
    tags: ["breakup", "abandonment", "closure"],
    mood: {
      type: 'heartbroken',
      emoji: '',
      label: 'Heartbroken',
      color: '#c49484'
    },
    reactions: { heartbroken: 28, lol: 1, hug: 15, exSucks: 9, total: 53 },
    readCount: 78,
    isPublished: true,
    slug: createSlug("When Everything Fell Apart")
  },
  {
    title: "The Day I Laughed Again",
    body: "Six months after the divorce, I did something I thought I'd never do again - I laughed. Not a polite chuckle or a forced smile, but a real, belly-deep laugh that caught me completely off guard. It happened at the grocery store of all places. A little kid was throwing a tantrum over cereal, and his mom looked absolutely exhausted. 'At least someone knows what they want,' I said to her, and we both just started laughing. It was such a small moment, but it felt like everything. Like the first green shoot pushing through concrete after a long winter. I realized then that healing isn't about forgetting or 'getting over it.' It's about finding space for joy again, even when the sadness is still there. It's about remembering that you're more than your worst day, more than your biggest heartbreak.",
    authorName: "Rising Phoenix",
    dateOfMemory: "2025-06-20",
    dateSubmitted: new Date('2025-08-03').toISOString(),
    tags: ["healing", "hope", "new beginnings"],
    mood: {
      type: 'hopeful',
      emoji: '',
      label: 'Hopeful',
      color: '#a8c49e'
    },
    reactions: { heartbroken: 3, lol: 22, hug: 18, exSucks: 0, total: 43 },
    readCount: 62,
    isPublished: true,
    slug: createSlug("The Day I Laughed Again")
  },
  {
    title: "The One That Got Away",
    body: "We met in a coffee shop on a rainy Thursday. You were reading Murakami and wearing that vintage band t-shirt that was too big for you. I almost didn't say anything - I'm not usually brave with strangers - but something about the way you smiled at the barista made me think you might be worth the risk. We talked for three hours about books and music and all the places we wanted to travel. You gave me your number on a napkin with a little doodle of a cat. I kept that napkin in my wallet for two years. We texted for weeks, made plans to meet again, but life kept getting in the way. You had exams, I had work, you were moving cities, I was... scared, probably. One day the texts just stopped. I never saw you again, but I still think about you every time it rains. I wonder if you ever think about the stranger who approached you in that coffee shop, or if I'm just a half-remembered face from a Thursday that meant everything to me and nothing to you.",
    authorName: "Still Wondering",
    dateOfMemory: "2023-09-14",
    dateSubmitted: new Date('2025-08-04').toISOString(),
    tags: ["missed connection", "what if", "coffee shop"],
    mood: {
      type: 'regretful',
      emoji: '',
      label: 'Regretful',
      color: '#8b6f52'
    },
    reactions: { heartbroken: 18, lol: 2, hug: 12, exSucks: 0, total: 32 },
    readCount: 39,
    isPublished: true,
    slug: createSlug("The One That Got Away")
  },
  {
    title: "Thank You, Next",
    body: "To my ex: Thank you for showing me exactly what I don't want in a relationship. Thank you for the lies that taught me to trust my intuition. Thank you for the gaslighting that made me stronger. Thank you for cheating, because it forced me to realize I deserve better. Thank you for never listening, because it helped me find my voice. Thank you for making me feel small, because it taught me how to take up space. Thank you for leaving, because staying would have been worse. I'm not bitter anymore. I'm grateful. You were never my person - you were my lesson. And what a valuable lesson you were.",
    authorName: "Lesson Learned",
    dateOfMemory: "2024-12-31",
    dateSubmitted: new Date('2025-08-05').toISOString(),
    tags: ["toxic relationship", "growth", "gratitude"],
    mood: {
      type: 'grateful',
      emoji: '',
      label: 'Grateful',
      color: '#8b9f52'
    },
    reactions: { heartbroken: 5, lol: 15, hug: 8, exSucks: 25, total: 53 },
    readCount: 87,
    isPublished: true,
    slug: createSlug("Thank You, Next")
  }
];

// Sample comments data - simplified for Firestore compatibility
const sampleComments = [
  {
    storyId: '', // Will be filled when stories are created
    authorName: "Someone Who Gets It",
    body: "I felt this in my soul. Thank you for sharing your story.",
    timestamp: new Date('2025-08-01T14:30:00').toISOString(),
    isSupport: true,
    reactions: { hearts: 5, hugs: 3 }
  },
  {
    storyId: '', // Will be filled when stories are created
    authorName: "Fellow Survivor",
    body: "You're so much stronger than you know. Sending virtual hugs!",
    timestamp: new Date('2025-08-02T09:15:00').toISOString(),
    isSupport: true,
    reactions: { hearts: 8, hugs: 12 }
  }
];

// Sample site stats - simplified for Firestore compatibility
const sampleSiteStats = {
  totalStories: 5,
  totalReactions: 201,
  totalComments: 2,
  popularTags: [
    { tag: "heartbreak", count: 15 },
    { tag: "healing", count: 12 },
    { tag: "first love", count: 8 },
    { tag: "closure", count: 6 },
    { tag: "what if", count: 5 }
  ],
  moodDistribution: [
    { mood: 'heartbroken', count: 18 },
    { mood: 'hopeful', count: 12 },
    { mood: 'nostalgic', count: 10 },
    { mood: 'grateful', count: 8 },
    { mood: 'regretful', count: 6 }
  ],
  storiesThisWeek: 5,
  storiesThisMonth: 5
};

export async function populateFirestore() {
  console.log('🔥 Starting Firestore population...');
  
  try {
    // Initialize Firebase (same pattern as working debug script)
    const firebaseConfig = {
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID,
      measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
    };
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Create stories collection with sample data
    console.log('📝 Creating stories...');
    const storyIds: string[] = [];
    
    for (const storyData of sampleStories) {
      const storyRef = doc(collection(db, COLLECTIONS.STORIES));
      const storyWithId = {
        ...storyData,
        id: storyRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(storyRef, storyWithId);
      storyIds.push(storyRef.id);
      console.log(`✅ Created story: "${storyData.title}"`);
    }

    // Create comments for first two stories
    console.log('💬 Creating comments...');
    for (let i = 0; i < Math.min(sampleComments.length, storyIds.length); i++) {
      const commentData = {
        ...sampleComments[i],
        storyId: storyIds[i],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, COLLECTIONS.COMMENTS), commentData);
      console.log(`✅ Created comment for story ${i + 1}`);
    }

    // Create sample user reactions
    console.log('❤️ Creating user reactions...');
    const reactionTypes = REACTION_OPTIONS.map(r => r.type);
    
    for (let i = 0; i < storyIds.length; i++) {
      const storyId = storyIds[i];
      const numReactions = Math.floor(Math.random() * 10) + 5; // 5-15 reactions per story
      
      for (let j = 0; j < numReactions; j++) {
        const randomReactionType = reactionTypes[Math.floor(Math.random() * reactionTypes.length)];
        const reactionData = {
          storyId: storyId,
          reactionType: randomReactionType,
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(), // Random time in last week
          userFingerprint: generateFingerprint(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await addDoc(collection(db, COLLECTIONS.REACTIONS), reactionData);
      }
      console.log(`✅ Created reactions for story ${i + 1}`);
    }

    // Create site stats
    console.log('📊 Creating site statistics...');
    const statsData = {
      ...sampleSiteStats,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, COLLECTIONS.SITE_STATS, 'current'), statsData);
    console.log('✅ Created site statistics');

    console.log('🎉 Firestore population completed successfully!');
    console.log(`📝 Created ${sampleStories.length} stories`);
    console.log(`💬 Created ${sampleComments.length} comments`);
    console.log(`❤️ Created user reactions`);
    console.log(`📊 Created site statistics`);
    
  } catch (error) {
    console.error('❌ Error populating Firestore:', error);
    throw error;
  }
}

// Run the population script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  populateFirestore()
    .then(() => {
      console.log('✨ All done! Your Firestore is ready to go.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Population failed:', error);
      process.exit(1);
    });
}
