import { config } from 'dotenv';
import { db } from './firebaseConfig.node';
import { doc, getDoc } from 'firebase/firestore';

// Load environment variables
config();

async function checkFirestoreSetup() {
  console.log('🔍 Checking Firestore setup...');
  console.log(`Project ID: ${process.env.VITE_FIREBASE_PROJECT_ID}`);
  
  try {
    // Try to read a document (this will fail if Firestore isn't set up)
    const testDoc = doc(db, 'test', 'test');
    const docSnap = await getDoc(testDoc);
    
    console.log('✅ Firestore is accessible!');
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
    } else {
      console.log('Test document does not exist (this is normal)');
    }
    
  } catch (error: any) {
    console.error('❌ Firestore error:', error);
    
    if (error.code === 'failed-precondition' || error.message?.includes('database has not been created')) {
      console.log('\n🚨 SOLUTION NEEDED:');
      console.log('1. Go to https://console.firebase.google.com/');
      console.log('2. Select your project: almost-archive');
      console.log('3. Click on "Firestore Database" in the left sidebar');
      console.log('4. Click "Create database"');
      console.log('5. Choose "Start in test mode" for now');
      console.log('6. Select your preferred location');
      console.log('7. Click "Done"');
      console.log('\nOnce Firestore is created, run the population script again!');
    }
  }
}

checkFirestoreSetup();
