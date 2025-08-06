import { config } from 'dotenv';
import { db } from './firebaseConfig.node';
import { doc, setDoc } from 'firebase/firestore';

config();

async function testMinimalWrite() {
  console.log('🧪 Testing minimal Firestore write...');
  
  try {
    // Absolutely minimal data
    const data = {
      test: "hello"
    };
    
    console.log('Writing data:', JSON.stringify(data, null, 2));
    await setDoc(doc(db, 'test', 'minimal'), data);
    console.log('✅ Minimal write succeeded!');
    
  } catch (error) {
    console.error('❌ Minimal write failed:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
  }
}

testMinimalWrite();
