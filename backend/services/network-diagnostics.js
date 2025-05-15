// This file contains network diagnostic tools for Square API
const https = require('https');
const dns = require('dns');
const { promisify } = require('util');

const dnsLookup = promisify(dns.lookup);
const dnsResolve = promisify(dns.resolve);

/**
 * Tests basic connectivity to a host
 * @param {string} host - The hostname to test
 * @returns {Promise<Object>} - Connection test results
 */
async function testHostConnectivity(host) {
  try {
    // Try to resolve the hostname to an IP address
    const dnsResult = await dnsLookup(host);
    
    return {
      success: true,
      host,
      ip: dnsResult.address,
      message: `Successfully resolved ${host} to ${dnsResult.address}`
    };
  } catch (error) {
    return {
      success: false,
      host,
      message: `Failed to resolve hostname ${host}: ${error.message}`,
      error
    };
  }
}

/**
 * Performs a basic HTTPS request to test connectivity
 * @param {string} url - The URL to test
 * @returns {Promise<Object>} - Connection test results
 */
function testHttpsConnection(url) {
  return new Promise((resolve) => {
    const timeoutMs = 5000; // 5-second timeout
    const startTime = Date.now();
    
    try {
      const req = https.get(url, { timeout: timeoutMs }, (res) => {
        const endTime = Date.now();
        
        resolve({
          success: true,
          url,
          statusCode: res.statusCode,
          responseTime: endTime - startTime,
          message: `Connected to ${url} (Status: ${res.statusCode}) in ${endTime - startTime}ms`
        });
        
        // Consume response data to free up memory
        res.resume();
      });
      
      req.on('error', (error) => {
        resolve({
          success: false,
          url,
          message: `Failed to connect to ${url}: ${error.message}`,
          error
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve({
          success: false,
          url,
          message: `Connection to ${url} timed out after ${timeoutMs}ms`,
          error: { code: 'TIMEOUT', message: 'Request timed out' }
        });
      });
    } catch (error) {
      resolve({
        success: false,
        url,
        message: `Error creating HTTPS request to ${url}: ${error.message}`,
        error
      });
    }
  });
}

/**
 * Runs comprehensive network diagnostics for Square API
 */
async function runSquareNetworkDiagnostics() {
  console.log('========== SQUARE API NETWORK DIAGNOSTICS ==========');
  console.log('Starting network diagnostics...');
  console.log('--------------------------------------------------');
  
  // Test DNS resolution
  console.log('Testing DNS resolution for Square API domains...');
  const hosts = [
    'connect.squareup.com',
    'connect.squareupsandbox.com'
  ];
  
  for (const host of hosts) {
    const dnsResult = await testHostConnectivity(host);
    console.log(`${dnsResult.success ? '✓' : '✗'} ${dnsResult.message}`);
  }
  console.log('--------------------------------------------------');
  
  // Test HTTPS connectivity
  console.log('Testing HTTPS connectivity to Square API endpoints...');
  const endpoints = [
    'https://connect.squareup.com/v2/locations',
    'https://connect.squareupsandbox.com/v2/locations'
  ];
  
  for (const endpoint of endpoints) {
    const httpsResult = await testHttpsConnection(endpoint);
    console.log(`${httpsResult.success ? '✓' : '✗'} ${httpsResult.message}`);
  }
  console.log('--------------------------------------------------');
  
  console.log('Network diagnostics completed');
  console.log('=================================================');
}

module.exports = {
  runSquareNetworkDiagnostics,
  testHostConnectivity,
  testHttpsConnection
};
