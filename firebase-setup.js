// This script helps set up Firebase emulators for local development
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Create firebase.json if it doesn't exist
const firebaseConfigPath = path.join(__dirname, 'firebase.json');
if (!fs.existsSync(firebaseConfigPath)) {
  const firebaseConfig = {
    "emulators": {
      "auth": {
        "port": 9099
      },
      "ui": {
        "enabled": true,
        "port": 4000
      }
    }
  };
  
  fs.writeFileSync(firebaseConfigPath, JSON.stringify(firebaseConfig, null, 2));
  console.log('Created firebase.json for emulator configuration');
}

// Check if Firebase CLI is installed
exec('firebase --version', (error) => {
  if (error) {
    console.log('Firebase CLI is not installed. Installing...');
    console.log('Run: npm install -g firebase-tools');
    console.log('After installation, run: firebase login');
    console.log('Then run: npm run firebase-emulator');
  } else {
    console.log('Firebase CLI detected. You can start emulators with:');
    console.log('firebase emulators:start');
  }
});

console.log('\nSetup Complete');
console.log('1. Replace the firebase configuration in src/firebase.js with your project credentials');
console.log('2. For local development without a real Firebase project, use the emulators');
console.log('3. To use real Firebase, make sure to update the apiKey and other values');
