const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');

// Check if .env file exists
if (fs.existsSync(envPath)) {
  console.log(`Loading environment from ${envPath}`);
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  
  // Set env variables
  for (const key in envConfig) {
    process.env[key] = envConfig[key];
  }
} else {
  console.log('No .env file found, using default environment');
  dotenv.config();
}

const express = require('express');
const cors = require('cors');
const catalogRoutes = require('./routes/catalog');
const customerRoutes = require('./routes/customers');
const estimateRoutes = require('./routes/estimates');
const invoiceRoutes = require('./routes/invoices');
const scheduleRoutes = require('./routes/schedule');
const settingsRoutes = require('./routes/settings');
const systemMetadataRouter = require('./routes/system-metadata');
const chatbotHistoryRouter = require('./routes/chatbot-history');
const systemLogsRouter = require('./routes/system-logs');
const customersDbRouter = require('./routes/customers-db');
const { testConnection } = require('./services/square');
const { runSquareNetworkDiagnostics } = require('./services/network-diagnostics');

const app = express();
const PORT = process.env.PORT || 9876;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/catalog', catalogRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/estimates', estimateRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/system-metadata', systemMetadataRouter);
app.use('/api/chatbot-history', chatbotHistoryRouter);
app.use('/api/system-logs', systemLogsRouter);
app.use('/api/customers-db', customersDbRouter);

// Test Square API connection
app.get('/api/test-square-connection', async (req, res, next) => {
  try {
    // First run network diagnostics
    console.log('Running network diagnostics before testing Square connection...');
    await runSquareNetworkDiagnostics();
    
    const result = await testConnection();
    if (result.success) {
      res.json(result);
    } else {
      // Log the error details server-side
      console.error('Square connection test failed:', 
        result.error ? JSON.stringify(result.error, null, 2) : 'Unknown error');
      
      // Return a clean error to the client
      res.status(500).json({
        success: false,
        message: result.message || 'Connection test failed',
        details: result.error?.details || 'See server logs for more information'
      });
    }
  } catch (error) {
    console.error('Unexpected error in test connection route:', error);
    
    // Check if this is a network error
    if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      return res.status(500).json({
        success: false,
        message: 'Failed to connect: Network Error',
        details: `Network error (${error.code}): Could not reach Square API servers. Please check your internet connection.`
      });
    }
    res.status(500).json({
      success: false,
      message: 'Connection test failed due to an unexpected error',
      details: error.message
    });
  }
});

// Network diagnostics endpoint for Square API
app.get('/api/network-diagnostics', async (req, res) => {
  try {
    // Send initial response to prevent timeout
    res.write('Running network diagnostics... Results will appear below:\n\n');
    
    // Capture console output
    const originalConsoleLog = console.log;
    let diagnosticOutput = '';
    
    console.log = (...args) => {
      const output = args.join(' ') + '\n';
      diagnosticOutput += output;
      originalConsoleLog(...args);
    };
    
    // Run diagnostics
    await runSquareNetworkDiagnostics();
    
    // Restore console.log
    console.log = originalConsoleLog;
    
    // Send results
    res.end(diagnosticOutput);
  } catch (error) {
    res.status(500).send(`Error running network diagnostics: ${error.message}`);
  }
});

// Basic root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Square API Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    error: true,
    message: err.message || 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
