import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';

config();

async function populateSimplified() {
  console.log('🚀 Starting simplified Firestore population...');
  
  try {
    // Initialize Firebase exactly like the working debug script
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
    
    // Create one simple story first
    console.log('📝 Creating first story...');
    const story1 = {
      title: "Test Story",
      body: "This is a test story to see if we can write to Firestore.",
      authorName: "Test Author",
      dateSubmitted: new Date().toISOString(),
      tags: ["test"],
      readCount: 0,
      isPublished: true,
      slug: "test-story"
    };
    
    await setDoc(doc(db, 'stories', 'story1'), story1);
    console.log('✅ Created first story successfully');
    
    // Try creating another document in a different collection
    console.log('💬 Creating a comment...');
    const comment1 = {
      storyId: 'story1',
      authorName: 'Test Commenter',
      body: 'This is a test comment',
      timestamp: new Date().toISOString(),
      isSupport: true
    };
    
    await addDoc(collection(db, 'comments'), comment1);
    console.log('✅ Created comment successfully');
    
    console.log('🎉 Simplified population completed!');
    
  } catch (error: any) {
    console.error('❌ Error in simplified population:');
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
  }
}

populateSimplified();
