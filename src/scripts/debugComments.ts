// Debug script to check comments in Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function debugComments() {
  try {
    console.log('🔍 Checking all comments in database...');
    
    // Get all comments
    const allCommentsSnapshot = await getDocs(collection(db, 'comments'));
    console.log(`Found ${allCommentsSnapshot.docs.length} total comments`);
    
    allCommentsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log('Comment:', {
        id: doc.id,
        storyId: data.storyId,
        authorName: data.authorName,
        body: data.body?.substring(0, 50) + '...',
        timestamp: data.timestamp
      });
    });
    
    // Get all stories to check IDs
    console.log('\n🔍 Checking all stories...');
    const allStoriesSnapshot = await getDocs(collection(db, 'stories'));
    console.log(`Found ${allStoriesSnapshot.docs.length} total stories`);
    
    allStoriesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log('Story:', {
        id: doc.id,
        title: data.title,
        slug: data.slug
      });
    });
    
    // Test comment query for first story
    if (allStoriesSnapshot.docs.length > 0) {
      const firstStoryId = allStoriesSnapshot.docs[0].id;
      console.log(`\n🔍 Testing comment query for story: ${firstStoryId}`);
      
      const commentsQuery = query(
        collection(db, 'comments'),
        where('storyId', '==', firstStoryId)
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      console.log(`Found ${commentsSnapshot.docs.length} comments for this story`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function when script loads
debugComments();
