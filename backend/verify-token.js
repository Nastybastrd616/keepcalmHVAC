// Simple tool to verify the Square API token is being saved correctly
const fs = require('fs').promises;
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');

async function verifyToken() {
  try {
    // Read the .env file
    const content = await fs.readFile(envPath, 'utf8');
    console.log('\n=== SQUARE API TOKEN VERIFICATION ===');
    
    // Check for token
    if (content.includes('SQUARE_ACCESS_TOKEN=')) {
      const lines = content.split('\n');
      for (const line of lines) {
        if (line.startsWith('SQUARE_ACCESS_TOKEN=')) {
          // Show only first few characters for security
          const token = line.split('=')[1];
          const maskedToken = token.substring(0, 5) + '...' + token.substring(token.length - 5);
          console.log('✓ Token found in .env file:', maskedToken);
          return true;
        }
      }
    } else {
      console.log('✗ No token found in .env file');
      return false;
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}

// Run verification
verifyToken().then((success) => {
  if (!success) {
    console.log('Try manually editing the .env file with a text editor to ensure it\'s writable.');
  } else {
    console.log('Your token is correctly saved in the .env file.');
  }
});
