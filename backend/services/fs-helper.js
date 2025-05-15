// File system helper utilities
const fs = require('fs').promises;
const path = require('path');

/**
 * Ensures a file exists and is writable
 * If file doesn't exist, creates it with default content
 * @param {string} filePath - Path to the file
 * @param {string} defaultContent - Default content if file needs to be created
 * @returns {Promise<boolean>} True if file is writable
 */
async function ensureFileExists(filePath, defaultContent = '') {
  try {
    // Check if file exists
    try {
      await fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK);
      console.log(`File ${filePath} exists and is writable`);
      return true;
    } catch (accessError) {
      // File doesn't exist or isn't writable
      console.log(`File ${filePath} doesn't exist or isn't writable, creating it...`);
      
      // Make sure the directory exists
      const dirPath = path.dirname(filePath);
      await fs.mkdir(dirPath, { recursive: true });
      
      // Create the file with default content
      await fs.writeFile(filePath, defaultContent);
      console.log(`Created file ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error(`Error ensuring file ${filePath} exists:`, error);
    return false;
  }
}

/**
 * Safely writes content to a file, ensuring path exists
 * @param {string} filePath - Path to write to
 * @param {string} content - Content to write
 * @returns {Promise<boolean>} True if write was successful
 */
async function safeWriteFile(filePath, content) {
  try {
    // Make sure the directory exists
    const dirPath = path.dirname(filePath);
    await fs.mkdir(dirPath, { recursive: true });
    
    // Write the file
    await fs.writeFile(filePath, content);
    return true;
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
    return false;
  }
}

module.exports = {
  ensureFileExists,
  safeWriteFile
};
