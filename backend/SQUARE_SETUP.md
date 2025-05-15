# Square API Setup and Troubleshooting Guide

## Issue Found
You were using an application ID (`sq0idp-CFBRApOlSVfOCF_2-Dk7sQ`) as your access token, which caused authentication errors.

## Steps to Fix

1. Log in to your [Square Developer Dashboard](https://developer.squareup.com/apps)

2. Select your application

3. Navigate to the **Credentials** tab

4. Obtain the correct credentials:
   - **Application ID**: `sq0idp-CFBRApOlSVfOCF_2-Dk7sQ` (already in your config)
   - **Access Token**:
     - For sandbox testing: Copy the **Sandbox Access Token** (starts with `EAAAEaW`)
     - For production: Copy the **Production Access Token** (starts with `EAAA`)

5. Update your `.env` file with the correct values:
   ```
   SQUARE_APPLICATION_ID=sq0idp-CFBRApOlSVfOCF_2-Dk7sQ
   SQUARE_ACCESS_TOKEN=EAAAEaW...  # Your actual token here
   NODE_ENV=development  # Use 'production' when going live
   SQUARE_API_TIMEOUT=15000  # Timeout in milliseconds
   ```

6. Restart your server after making these changes

## Testing the Connection

After updating your credentials, you can test the connection by accessing:
```
http://localhost:9876/api/test-square-connection
```

This endpoint will confirm if your Square API connection is working correctly.

## Network Diagnostics

If you receive "Network Error" messages, you can run network diagnostics:
```
http://localhost:9876/api/network-diagnostics
```

This will check:
- DNS resolution for Square API domains
- HTTPS connectivity to Square API endpoints
- Response times and status codes

## Common Issues and Solutions

### "Failed to connect: Network Error"
Possible causes:
- No internet connection on the server
- Firewall blocking outbound connections
- DNS resolution failure
- Square API service disruption

Solutions:
1. Check your internet connection
2. Verify firewall settings allow outgoing HTTPS (port 443)
3. Run the network diagnostics tool
4. Check [Square Status Page](https://status.developer.squareup.com/)

### "401 Unauthorized" 
Possible causes:
- Invalid access token
- Expired access token
- Using production token in sandbox environment (or vice versa)

Solutions:
1. Verify you're using the correct access token
2. Ensure token matches environment setting (sandbox/production)
3. Generate a new access token in Square Developer Dashboard

### "403 Forbidden"
Possible causes:
- Token doesn't have required permissions
- Account limitations

Solutions:
1. Check application permissions in Square Developer Dashboard
2. Ensure your Square account is in good standing

### "429 Too Many Requests"
Possible causes:
- Rate limit exceeded

Solutions:
1. Implement retry logic with exponential backoff
2. Optimize code to reduce number of API calls

## Additional Notes

- For testing, use the Sandbox environment and credentials
- Sandbox tokens start with `EAAAEaW`, production tokens start with `EAAA`
- Never commit your access tokens to GitHub or other public repositories
- Set appropriate timeouts for API calls (default is now 15 seconds)
- The API client now includes automatic retries for transient errors
