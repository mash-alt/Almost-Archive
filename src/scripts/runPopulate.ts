import { config } from 'dotenv';
import { populateFirestore } from './populateFirestore';

// Load environment variables
config();

// Simple script runner
async function runScript() {
  console.log('🚀 Running Firestore population script...\n');
  
  try {
    await populateFirestore();
    console.log('\n✨ Script completed successfully!');
  } catch (error) {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  }
}

runScript();
