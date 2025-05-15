/**
 * Settings Check Utility
 * 
 * This script can be run directly with Node.js to check if settings
 * can be properly read and written to the .env file.
 * 
 * Usage:
 *   node settings-check.js
 */

const fs = require('fs').promises;
const path = require('path');
const { ensureFileExists, safeWriteFile } = require('./services/fs-helper');

// Path to .env file
const envPath = path.resolve(process.cwd(), '.env');

// Check if the file exists and can be read
async function checkReadAccess() {
  try {
    console.log(`Checking if ${envPath} exists and can be read...`);
    await fs.access(envPath, fs.constants.F_OK | fs.constants.R_OK);
    console.log('✓ File exists and can be read');
    
    const content = await fs.readFile(envPath, 'utf8');
    console.log('✓ File content read successfully');
    
    // Count lines and check for expected variables
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('//'));
    console.log(`✓ File contains ${lines.length} settings lines`);
    
    // Check for required settings
    const requiredSettings = ['SQUARE_ACCESS_TOKEN', 'SQUARE_APPLICATION_ID', 'NODE_ENV'];
    const foundSettings = [];
    
    lines.forEach(line => {
      const [key] = line.split('=');
      if (key && requiredSettings.includes(key.trim())) {
        foundSettings.push(key.trim());
      }
    });
    
    console.log(`✓ Found ${foundSettings.length}/${requiredSettings.length} required settings:`);
    console.log('  - ' + foundSettings.join('\n  - '));
    
    const missingSettings = requiredSettings.filter(s => !foundSettings.includes(s));
    if (missingSettings.length > 0) {
      console.log('⚠ Missing settings:');
      console.log('  - ' + missingSettings.join('\n  - '));
    }
    
    return true;
  } catch (error) {
    console.error('✗ Error accessing file:', error.message);
    return false;
  }
}

// Check if the file can be written to
async function checkWriteAccess() {
  try {
    console.log(`\nChecking if ${envPath} can be written to...`);
    
    // Try to write a test timestamp to the file
    const timestamp = new Date().toISOString();
    
    // First read the current content
    let content = await fs.readFile(envPath, 'utf8');
    
    // Check if LAST_CHECK already exists
    if (content.includes('LAST_CHECK=')) {
      // Replace existing timestamp
      content = content.replace(/LAST_CHECK=.*(\n|$)/, `LAST_CHECK=${timestamp}\n`);
    } else {
      // Add new timestamp at the end
      content += `\nLAST_CHECK=${timestamp}`;
    }
    
    // Write back to file
    await fs.writeFile(envPath, content);
    console.log('✓ Successfully wrote to file');
    
    // Verify the timestamp was written
    const newContent = await fs.readFile(envPath, 'utf8');
    if (newContent.includes(`LAST_CHECK=${timestamp}`)) {
      console.log('✓ Verified write was successful');
      return true;
    } else {
      console.error('✗ Could not verify write was successful');
      return false;
    }
  } catch (error) {
    console.error('✗ Error writing to file:', error.message);
    return false;
  }
}

// Run the checks
async function runChecks() {
  console.log('=== SETTINGS ACCESS CHECK ===');
  console.log('Checking access to settings file...\n');
  
  const readResult = await checkReadAccess();
  const writeResult = await checkWriteAccess();
  
  console.log('\n=== RESULTS ===');
  console.log(`Read access: ${readResult ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`Write access: ${writeResult ? '✓ PASS' : '✗ FAIL'}`);
  
  if (!readResult || !writeResult) {
    console.log('\n=== TROUBLESHOOTING ===');
    console.log('If checks failed, try these steps:');
    console.log('1. Make sure the .env file exists in the backend directory');
    console.log('2. Check file permissions (run as administrator):');
    console.log('   $acl = Get-Acl ".env"');
    console.log('   $username = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name');
    console.log('   $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule($username,"FullControl","Allow")');
    console.log('   $acl.SetAccessRule($accessRule)');
    console.log('   $acl | Set-Acl ".env"');
    console.log('3. Try manually creating a new .env file with the required settings');
  }
}

// Run the checks when script is executed directly
if (require.main === module) {
  runChecks();
}

module.exports = { checkReadAccess, checkWriteAccess, runChecks };
