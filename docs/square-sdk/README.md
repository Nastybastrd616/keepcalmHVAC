# Square SDK Documentation

This directory contains reference documentation for the Square SDK, which is used in this project for handling payments, invoices, customers, and estimates.

## Official Documentation Links

- [Square Developer Documentation](https://developer.squareup.com/docs)
- [Square Node.js SDK](https://developer.squareup.com/docs/sdks/nodejs)
- [API Reference](https://developer.squareup.com/reference/square)

## Key Square APIs Used in This Project

### Customers API
- [Customers API Documentation](https://developer.squareup.com/docs/customers-api/what-it-does)
- [API Reference](https://developer.squareup.com/reference/square/customers-api)

#### Key Endpoints
```javascript
// Create a customer
client.customersApi.createCustomer(requestBody);

// Retrieve a customer
client.customersApi.retrieveCustomer(customerId);

// Update a customer
client.customersApi.updateCustomer(customerId, requestBody);

// Delete a customer
client.customersApi.deleteCustomer(customerId);

// List customers
client.customersApi.listCustomers(cursor, limit, sortField, sortOrder);

// Search customers
client.customersApi.searchCustomers(requestBody);
```

### Invoices API
- [Invoices API Documentation](https://developer.squareup.com/docs/invoices-api/overview)
- [API Reference](https://developer.squareup.com/reference/square/invoices-api)

#### Key Endpoints
```javascript
// Create invoice
client.invoicesApi.createInvoice(requestBody);

// Search invoices
client.invoicesApi.searchInvoices(requestBody);

// Get invoice
client.invoicesApi.getInvoice(invoiceId);

// Update invoice
client.invoicesApi.updateInvoice(invoiceId, requestBody);

// Delete invoice
client.invoicesApi.deleteInvoice(invoiceId, version);

// Publish invoice
client.invoicesApi.publishInvoice(invoiceId, requestBody);

// Cancel invoice
client.invoicesApi.cancelInvoice(invoiceId, requestBody);
```

### Catalog API
- [Catalog API Documentation](https://developer.squareup.com/docs/catalog-api/what-it-does)
- [API Reference](https://developer.squareup.com/reference/square/catalog-api)

#### Key Endpoints
```javascript
// List catalog objects
client.catalogApi.listCatalog(cursor, types);

// Retrieve catalog object
client.catalogApi.retrieveCatalogObject(objectId, includeRelatedObjects);

// Search catalog objects
client.catalogApi.searchCatalogObjects(requestBody);

// Batch upsert catalog objects
client.catalogApi.batchUpsertCatalogObjects(requestBody);

// Create catalog image
client.catalogApi.createCatalogImage(requestBody, imageFile);

// Update catalog image
client.catalogApi.updateCatalogImage(imageId, requestBody, imageFile);
```

### Payments API
- [Payments API Documentation](https://developer.squareup.com/docs/payments-api/overview)
- [API Reference](https://developer.squareup.com/reference/square/payments-api)

#### Key Endpoints
```javascript
// Create payment
client.paymentsApi.createPayment(requestBody);

// Get payment
client.paymentsApi.getPayment(paymentId);

// Update payment
client.paymentsApi.updatePayment(paymentId, requestBody);

// Cancel payment
client.paymentsApi.cancelPayment(paymentId);

// Complete payment
client.paymentsApi.completePayment(paymentId, requestBody);

// List payments
client.paymentsApi.listPayments(beginTime, endTime, sortOrder, cursor, locationId, total, last4, cardBrand, limit);
```

### Orders API
- [Orders API Documentation](https://developer.squareup.com/docs/orders-api/what-it-does)
- [API Reference](https://developer.squareup.com/reference/square/orders-api)

#### Key Endpoints
```javascript
// Create order
client.ordersApi.createOrder(requestBody);

// Batch retrieve orders
client.ordersApi.batchRetrieveOrders(requestBody);

// Update order
client.ordersApi.updateOrder(orderId, requestBody);

// Pay order
client.ordersApi.payOrder(orderId, requestBody);

// Search orders
client.ordersApi.searchOrders(requestBody);
```

### Estimates (Custom Implementation)
Square doesn't have a native Estimates API, so we implement this using Custom Attributes on other objects.

```javascript
// Example: Creating an estimate using Catalog Custom Objects
client.catalogApi.upsertCatalogObject({
  object: {
    type: 'CUSTOM_OBJECT',
    id: '#Estimate',
    customObjectData: {
      name: 'estimate',
      customAttributes: [
        { key: 'customer_id', stringValue: 'CUSTOMER_ID' },
        { key: 'status', stringValue: 'DRAFT' },
        { key: 'due_date', stringValue: '2023-12-31' },
        { key: 'amount', numberValue: '100.00' }
      ]
    }
  }
});
```

## Installation

The Square SDK is installed in the backend directory of this project:

```bash
cd backend
npm install --save square
```

## Usage Example

```javascript
const { Client, Environment } = require('square');

// Create a Square client
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox // Use Environment.Production for production
});

// Example: List customers
async function listCustomers() {
  try {
    const response = await client.customersApi.listCustomers();
    return response.result.customers;
  } catch (error) {
    console.error('Error listing customers:', error);
    throw error;
  }
}
```

## Backend Implementation Examples

### Setting Up Square Client in Your Backend

In your `backend/services/square.js` file:

```javascript
const { Client, Environment } = require('square');

// Initialize Square client
const initSquareClient = () => {
  return new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: process.env.NODE_ENV === 'production' 
      ? Environment.Production 
      : Environment.Sandbox
  });
};

module.exports = { initSquareClient };
```

### Implementing Customers API in Your Backend

In your `backend/services/customers.js` file:

```javascript
const { initSquareClient } = require('./square');

const client = initSquareClient();

const getCustomers = async () => {
  try {
    const response = await client.customersApi.listCustomers();
    return response.result.customers;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

const createCustomer = async (customerData) => {
  try {
    const response = await client.customersApi.createCustomer({
      givenName: customerData.firstName,
      familyName: customerData.lastName,
      emailAddress: customerData.email,
      phoneNumber: customerData.phone,
      address: customerData.address
    });
    return response.result.customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

module.exports = {
  getCustomers,
  createCustomer
  // Additional methods...
};
```

### Implementing Estimates in Your Backend

In your `backend/services/estimates.js` file:

```javascript
const { initSquareClient } = require('./square');
const { v4: uuidv4 } = require('uuid');

const client = initSquareClient();

// Since Square doesn't have a native Estimates API, we'll use Catalog API's custom objects
const createEstimate = async (estimateData) => {
  try {
    const estimateId = `estimate_${uuidv4()}`;
    
    const response = await client.catalogApi.upsertCatalogObject({
      idempotencyKey: uuidv4(),
      object: {
        type: 'CUSTOM_OBJECT',
        id: estimateId,
        customObjectData: {
          name: 'estimate',
          customAttributes: {
            customer_id: { stringValue: estimateData.customerId },
            title: { stringValue: estimateData.title },
            description: { stringValue: estimateData.description },
            due_date: { stringValue: estimateData.dueDate },
            amount: { stringValue: estimateData.amount.toString() },
            status: { stringValue: estimateData.status || 'DRAFT' },
            created_at: { stringValue: new Date().toISOString() }
          }
        }
      }
    });
    
    return response.result.object;
  } catch (error) {
    console.error('Error creating estimate:', error);
    throw error;
  }
};

module.exports = {
  createEstimate
  // Additional methods...
};
```

## Authentication

Square API requires authentication using access tokens. Be sure to store your tokens securely in environment variables and never commit them to version control.

```javascript
// Example .env file structure (never commit this file)
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_APPLICATION_ID=your_square_application_id
SQUARE_LOCATION_ID=your_square_location_id
```

## Error Handling and Rate Limiting

Square API has rate limits. For production applications, implement retry logic with exponential backoff:

```javascript
const squareApiCall = async (apiFunction) => {
  let retries = 0;
  const maxRetries = 3;
  
  while (retries < maxRetries) {
    try {
      return await apiFunction();
    } catch (error) {
      if (error.statusCode === 429) {
        // Rate limit hit - exponential backoff
        const delay = Math.pow(2, retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        retries++;
      } else {
        // Different error
        throw error;
      }
    }
  }
  
  throw new Error('Maximum retries exceeded');
};
```

## Webhooks

For real-time updates, consider using [Square Webhooks](https://developer.squareup.com/docs/webhooks/overview).

Example webhook handler in your backend:

```javascript
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

router.post('/square-webhook', (req, res) => {
  // Verify webhook signature
  const squareSignature = req.headers['x-square-signature'];
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  
  const hmac = crypto.createHmac('sha1', signatureKey);
  const expectedSignature = hmac.update(JSON.stringify(req.body)).digest('base64');
  
  if (expectedSignature !== squareSignature) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook event
  const event = req.body;
  
  switch(event.type) {
    case 'invoice.created':
      // Handle invoice creation
      break;
    case 'payment.created':
      // Handle payment creation
      break;
    // Add other event types as needed
  }
  
  res.status(200).send('Event received');
});

module.exports = router;
```
