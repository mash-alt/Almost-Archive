import { config } from 'dotenv';
import { db } from './firebaseConfig.node';
import { collection, doc, setDoc } from 'firebase/firestore';

// Load environment variables
config();

async function testSimpleWrite() {
  console.log('🧪 Testing simple Firestore write...');
  
  try {
    // Test with very simple data first
    const testData = {
      title: "Test Story",
      body: "This is a test story.",
      dateSubmitted: new Date().toISOString(),
      tags: ["test"],
      readCount: 0,
      isPublished: true
    };
    
    const testRef = doc(collection(db, 'test-stories'));
    await setDoc(testRef, testData);
    
    console.log('✅ Simple write succeeded!');
    console.log('Document ID:', testRef.id);
    
  } catch (error) {
    console.error('❌ Simple write failed:', error);
  }
}

testSimpleWrite();
