# Troubleshooting Square API Connection Issues

## Network Error

If you're receiving "Failed to connect: Network Error" when testing your Square connection, follow these steps:

### 1. Check Internet Connection
- Make sure your device is connected to the internet
- Try accessing other websites to verify connectivity
- Disable any VPNs or proxies temporarily

### 2. Check Firewall & Security Software
- Some security software may block outgoing connections
- Add exceptions for Node.js and your application
- Temporarily disable firewall to test (remember to re-enable it)

### 3. DNS Issues
- If DNS resolution is failing, try adding these entries to your hosts file:
  ```
  162.159.140.47 connect.squareup.com
  172.66.0.28 connect.squareupsandbox.com
  ```

### 4. Proxy Configuration
- If you're behind a corporate proxy, set these environment variables:
  ```
  HTTP_PROXY=http://your-proxy:port
  HTTPS_PROXY=http://your-proxy:port
  ```

## Authentication Errors (401 Unauthorized)

If you're receiving authentication errors:

### 1. Verify Access Token
- Ensure you're using the correct access token (not application ID)
- Production tokens start with `EAAA`
- Sandbox tokens start with `EAAAEaW`

### 2. Token Format
- Don't include any quotes around the token in your .env file
- Make sure there are no extra spaces or line breaks

### 3. Environment Mismatch
- Don't use a sandbox token with production environment
- Don't use a production token with sandbox environment

### 4. Token Expiration
- Some tokens expire after a certain time
- Log in to your Square Developer Dashboard to get a new token

## Testing Connectivity

Run this command to test network connectivity to Square's servers:

```powershell
cd "c:\Users\admin\Desktop\buisieness web\backend"; node -e "const { runSquareNetworkDiagnostics } = require('./services/network-diagnostics'); runSquareNetworkDiagnostics()"
```

If DNS resolution works but HTTPS connections fail, check your security software and proxy settings.

## Need More Help?

If you're still having issues, try these steps:

1. Make sure you have the latest Node.js version
2. Update the Square SDK: `npm update square`
3. Check for any proxies or network filters that might be interfering with HTTPS requests
4. Contact Square Developer support with the error details from your logs
