import { config } from 'dotenv';

config();

console.log('🔍 Firebase Configuration Diagnostics:');
console.log('=====================================');
console.log('Project ID:', process.env.VITE_FIREBASE_PROJECT_ID);
console.log('Auth Domain:', process.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('API Key:', process.env.VITE_FIREBASE_API_KEY ? `${process.env.VITE_FIREBASE_API_KEY.substring(0, 10)}...` : 'Missing');
console.log('Storage Bucket:', process.env.VITE_FIREBASE_STORAGE_BUCKET);

console.log('\n🚨 Please verify:');
console.log('1. Project ID "almost-archive" exists in your Firebase console');
console.log('2. Firestore Database has been created for this project');
console.log('3. The API key is correct and not expired');
console.log('4. The project has billing enabled (if required)');

console.log('\n💡 Common Issues:');
console.log('- Project ID mismatch');
console.log('- Firestore not enabled/created');
console.log('- Invalid API key');
console.log('- Network/firewall issues');
