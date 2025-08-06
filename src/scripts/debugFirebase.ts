import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, doc, setDoc } from 'firebase/firestore';

config();

async function debugFirebase() {
  console.log('🔧 Debug Firebase Connection...');
  
  try {
    const firebaseConfig = {
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID,
      measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
    };
    
    console.log('Initializing Firebase app...');
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized');
    
    console.log('Getting Firestore instance...');
    const db = getFirestore(app);
    console.log('✅ Firestore instance created');
    
    console.log('Attempting simple write...');
    const testRef = doc(db, 'debug', 'test');
    await setDoc(testRef, { test: 'hello' });
    console.log('✅ Write successful!');
    
  } catch (error: any) {
    console.error('❌ Error details:');
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('Full error:', error);
  }
}

debugFirebase();
