import { config } from 'dotenv';
import { db } from './firebaseConfig.node';
import { doc, setDoc } from 'firebase/firestore';

config();

async function testAbsoluteMinimal() {
  console.log('🔬 Testing absolute minimal write...');
  
  try {
    // Test 1: Just a string
    console.log('Test 1: Simple string field');
    await setDoc(doc(db, 'test', 'test1'), {
      message: "hello world"
    });
    console.log('✅ Test 1 passed');
    
    // Test 2: String and number
    console.log('Test 2: String and number fields');
    await setDoc(doc(db, 'test', 'test2'), {
      title: "test title",
      count: 42
    });
    console.log('✅ Test 2 passed');
    
    // Test 3: Add boolean
    console.log('Test 3: Adding boolean');
    await setDoc(doc(db, 'test', 'test3'), {
      title: "test title",
      count: 42,
      isActive: true
    });
    console.log('✅ Test 3 passed');
    
    // Test 4: Add array
    console.log('Test 4: Adding array');
    await setDoc(doc(db, 'test', 'test4'), {
      title: "test title",
      tags: ["tag1", "tag2"]
    });
    console.log('✅ Test 4 passed');
    
    console.log('🎉 All tests passed! Firestore is working.');
    
  } catch (error) {
    console.error('❌ Test failed at step:', error);
  }
}

testAbsoluteMinimal();
