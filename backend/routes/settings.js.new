const express = require('express');
const { readEnvFile, updateSettings, checkWritePermissions, getSystemInfo } = require('../services/settings-service');
const router = express.Router();

// GET /api/settings - Get current settings (non-sensitive)
router.get('/', async (req, res) => {
  try {
    // Get settings from .env file instead of process.env to ensure we have the latest
    const envVars = await readEnvFile();
    
    res.json({
      squareEnvironment: envVars.NODE_ENV || process.env.NODE_ENV || 'development',
      squareLocationId: envVars.SQUARE_LOCATION_ID || process.env.SQUARE_LOCATION_ID || '',
      squareApplicationId: envVars.SQUARE_APPLICATION_ID || process.env.SQUARE_APPLICATION_ID || '',
      // Don't send the actual token, just if it exists
      hasSquareToken: !!(envVars.SQUARE_ACCESS_TOKEN || process.env.SQUARE_ACCESS_TOKEN)
    });
  } catch (error) {
    console.error('Error retrieving settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve settings: ' + error.message
    });
  }
});

// POST /api/settings - Update settings
router.post('/', async (req, res) => {
  try {
    const { squareToken, squareEnvironment, squareLocationId, squareApplicationId } = req.body;
    
    console.log('Updating settings:', { 
      squareEnvironment, 
      squareLocationId, 
      hasToken: !!squareToken 
    });
    
    // First check if we have permission to write to the .env file
    const permissions = await checkWritePermissions();
    console.log('File permissions check:', permissions);
    
    if (!permissions.canWrite && !permissions.canCreate) {
      return res.status(500).json({
        success: false,
        message: 'Cannot save settings: No write permission to .env file',
        details: permissions
      });
    }
    
    // Prepare updates object
    const updates = {};
    
    // Only update token if it's provided and not the placeholder
    if (squareToken && squareToken !== '••••••••••••••••') {
      updates.SQUARE_ACCESS_TOKEN = squareToken;
    }
    
    // Update environment if provided
    if (squareEnvironment) {
      updates.NODE_ENV = squareEnvironment;
    }
    
    // Update location ID if provided
    if (squareLocationId !== undefined) {
      updates.SQUARE_LOCATION_ID = squareLocationId;
    }
    
    // Update application ID if provided
    if (squareApplicationId) {
      updates.SQUARE_APPLICATION_ID = squareApplicationId;
    }
    
    // Add a timestamp for debugging
    updates.LAST_UPDATED = new Date().toISOString();
    
    // Write settings to file
    const result = await updateSettings(updates);
    
    if (result.success) {
      return res.json({
        success: true,
        message: 'Settings updated successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to update settings: ' + result.error
      });
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: `Failed to save settings: ${error.message}`,
      error: error.toString()
    });
  }
});

// GET /api/settings/diagnostics - Get diagnostics information
router.get('/diagnostics', async (req, res) => {
  try {
    const envVars = await readEnvFile();
    const permissions = await checkWritePermissions();
    const systemInfo = getSystemInfo();
    
    res.json({
      success: true,
      diagnostics: {
        system: systemInfo,
        permissions,
        environment: {
          SQUARE_APPLICATION_ID: envVars.SQUARE_APPLICATION_ID ? '✓ Set' : '✗ Not set',
          SQUARE_ACCESS_TOKEN: envVars.SQUARE_ACCESS_TOKEN ? '✓ Set' : '✗ Not set',
          NODE_ENV: envVars.NODE_ENV || 'Not set',
          SQUARE_LOCATION_ID: envVars.SQUARE_LOCATION_ID || '✗ Not set',
          LAST_UPDATED: envVars.LAST_UPDATED || 'Never'
        }
      },
      message: 'Diagnostics completed'
    });
  } catch (error) {
    console.error('Error running diagnostics:', error);
    res.status(500).json({
      success: false,
      message: `Diagnostics error: ${error.message}`,
      error: error.toString()
    });
  }
});

// POST /api/settings/restart - Restart server to apply environment changes
router.post('/restart', async (req, res) => {
  try {
    // Send success response before restarting
    res.json({ success: true, message: 'Server will restart now' });
    
    // Log the restart
    console.log('Restarting server to apply environment changes...');
    
    // Schedule restart after response is sent
    setTimeout(() => {
      process.exit(0); // Exit with success code, process manager should restart
    }, 1000);
  } catch (error) {
    console.error('Error during restart:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error during restart' 
    });
  }
});

module.exports = router;
