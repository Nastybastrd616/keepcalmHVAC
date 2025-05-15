// Settings service for managing application settings
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// Determine the .env file path
const envPath = path.resolve(process.cwd(), '.env');

/**
 * Read and parse the current .env file content
 * @returns {Promise<Object>} Parsed environment variables
 */
async function readEnvFile() {
  try {
    // Try to read the file
    const content = await fs.readFile(envPath, 'utf8');
    
    // Parse the content into key-value pairs
    const envVars = {};
    content.split('\n').forEach(line => {
      // Skip comments and empty lines
      if (line.trim() && !line.trim().startsWith('//')) {
        const parts = line.split('=');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          // Join in case value contains = characters
          const value = parts.slice(1).join('=').trim();
          envVars[key] = value;
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error reading .env file:', error);
    return {};
  }
}

/**
 * Write environment variables back to the .env file
 * @param {Object} envVars - Environment variables to write
 * @returns {Promise<boolean>} Success status
 */
async function writeEnvFile(envVars) {
  try {
    // Convert object to .env format
    // Preserve any comments that were at the top of the original file
    let content = '// Settings file - updated ' + new Date().toISOString() + '\n';
    
    // Add each environment variable
    Object.entries(envVars).forEach(([key, value]) => {
      content += `${key}=${value}\n`;
    });
    
    // Write the file
    await fs.writeFile(envPath, content, 'utf8');
    console.log('Successfully wrote to .env file');
    
    // Verify the file was written
    try {
      await fs.access(envPath, fs.constants.R_OK | fs.constants.W_OK);
      return true;
    } catch (accessError) {
      console.error('Written file is not accessible:', accessError);
      return false;
    }
  } catch (error) {
    console.error('Error writing .env file:', error);
    return false;
  }
}

/**
 * Update specific environment variables
 * @param {Object} updates - Key-value pairs to update
 * @returns {Promise<Object>} Updated environment variables
 */
async function updateSettings(updates) {
  try {
    // Read current variables
    const currentEnv = await readEnvFile();
    
    // Apply updates
    const updatedEnv = { ...currentEnv, ...updates };
    
    // Write back to file
    const success = await writeEnvFile(updatedEnv);
    
    if (success) {
      // Update process.env as well for immediate effect
      try {
        if (typeof process !== 'undefined' && process.env) {
          Object.entries(updates).forEach(([key, value]) => {
            process.env[key] = value;
          });
        }
      } catch (processError) {
        console.warn('Could not update process.env (this is normal in browser context):', processError.message);
        // Continue - this might be running in a browser context
      }
      
      return { success: true, data: updatedEnv };
    } else {
      throw new Error('Failed to write settings to file');
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get basic system information
 * @returns {Object} System information
 */
function getSystemInfo() {
  try {
    return {
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      userInfo: os.userInfo().username,
      homedir: os.homedir(),
      tmpdir: os.tmpdir(),
      cwd: typeof process !== 'undefined' ? process.cwd() : 'unknown',
      envPath: envPath,
      nodeVersion: typeof process !== 'undefined' ? process.version : 'unknown',
      uptime: os.uptime()
    };
  } catch (error) {
    console.warn('Error getting system info (this might be running in a browser):', error.message);
    return {
      error: 'System information not available in this environment',
      isNodeJS: typeof process !== 'undefined' && !!process.versions
    };
  }
}

/**
 * Check if we have write permissions to the .env file
 * @returns {Promise<Object>} Result of the check
 */
async function checkWritePermissions() {
  try {
    // Try to get file stats
    let stats;
    try {
      stats = await fs.stat(envPath);
    } catch (statError) {
      // File doesn't exist, check if we can write to the directory
      const dirPath = path.dirname(envPath);
      try {
        await fs.access(dirPath, fs.constants.W_OK);
        return { 
          canWrite: true, 
          canCreate: true, 
          fileExists: false,
          message: 'File does not exist but can be created'
        };
      } catch (dirError) {
        return { 
          canWrite: false, 
          canCreate: false, 
          fileExists: false,
          message: 'Cannot write to directory: ' + dirError.message
        };
      }
    }
    
    // File exists, check if we can write to it
    try {
      await fs.access(envPath, fs.constants.W_OK);
      return { 
        canWrite: true, 
        fileExists: true, 
        size: stats.size,
        modified: stats.mtime,
        message: 'File exists and is writable'
      };
    } catch (accessError) {
      return { 
        canWrite: false, 
        fileExists: true,
        size: stats.size,
        modified: stats.mtime,
        message: 'File exists but is not writable: ' + accessError.message
      };
    }
  } catch (error) {
    console.error('Error checking write permissions:', error);
    return { 
      canWrite: false, 
      error: error.message,
      message: 'Error checking write permissions: ' + error.message
    };
  }
}

module.exports = {
  readEnvFile,
  writeEnvFile,
  updateSettings,
  getSystemInfo,
  checkWritePermissions
};
