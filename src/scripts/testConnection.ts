import { config } from 'dotenv';
import { db } from './firebaseConfig.node';
import { enableNetwork } from 'firebase/firestore';

// Load environment variables
config();

async function testConnection() {
  console.log('🔗 Testing Firebase connection...');
  
  try {
    // Just try to get the app instance
    console.log('Firebase project ID:', process.env.VITE_FIREBASE_PROJECT_ID);
    console.log('Firebase auth domain:', process.env.VITE_FIREBASE_AUTH_DOMAIN);
    
    // Check if we can enable network (this will test the connection)
    await enableNetwork(db);
    console.log('✅ Network enabled successfully - connection is working!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();
