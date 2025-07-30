const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://hosenagbaria.github.io',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ServiceNow configuration
const SERVICENOW_CONFIG = {
  baseUrl: process.env.SERVICENOW_BASE_URL || 'https://tanivdynamicsltddemo4.service-now.com',
  username: process.env.SERVICENOW_USERNAME || 'ext.portal.v2',
  password: process.env.SERVICENOW_PASSWORD || '*]<D7sP^KX+zW1Nn.VJ6P,(w=-$5QJ',
  clientId: process.env.SERVICENOW_CLIENT_ID || '1fcct8c927c54abbeb2ba990f6149043',
  clientSecret: process.env.SERVICENOW_CLIENT_SECRET || 'Jfjwy4o$eg'
};

// Helper function to make ServiceNow API requests
async function makeServiceNowRequest(endpoint, options = {}) {
  const url = `${SERVICENOW_CONFIG.baseUrl}${endpoint}`;
  
  const authHeader = `Basic ${Buffer.from(`${SERVICENOW_CONFIG.username}:${SERVICENOW_CONFIG.password}`).toString('base64')}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': authHeader,
  };

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ServiceNow API Error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('ServiceNow API request failed:', error);
    throw error;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ServiceNow API proxy endpoints

// Get catalog items
app.get('/api/servicenow/catalog/items', async (req, res) => {
  try {
    const { search, category, limit = 10, offset = 0 } = req.query;
    
    let query = 'active=true';
    if (search) {
      query += `^short_descriptionLIKE${search}^ORdescriptionLIKE${search}`;
    }
    if (category) {
      query += `^category=${category}`;
    }
    
    // Use sysparm_display_value=true to get display values for reference fields like category
    const endpoint = `/api/now/table/sc_cat_item?sysparm_query=${encodeURIComponent(query)}&sysparm_limit=${limit}&sysparm_offset=${offset}&sysparm_fields=sys_id,name,short_description,description,price,picture,category,order&sysparm_display_value=true`;
    
    const data = await makeServiceNowRequest(endpoint);
    res.json(data);
  } catch (error) {
    console.error('Error fetching catalog items:', error);
    res.status(500).json({ error: 'Failed to fetch catalog items', message: error.message });
  }
});

// Get catalog item details
app.get('/api/servicenow/catalog/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    // Use sysparm_display_value=true to get display values for reference fields
    const endpoint = `/api/now/table/sc_cat_item/${itemId}?sysparm_display_value=true`;
    
    const data = await makeServiceNowRequest(endpoint);
    res.json(data);
  } catch (error) {
    console.error('Error fetching catalog item details:', error);
    res.status(500).json({ error: 'Failed to fetch catalog item details', message: error.message });
  }
});

// Get catalog item form (ServiceNow Service Catalog API)
app.get('/api/sn_sc/servicecatalog/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    // Use the ServiceNow Service Catalog API to get item with variables
    const endpoint = `/api/sn_sc/servicecatalog/items/${itemId}`;
    
    const data = await makeServiceNowRequest(endpoint);
    res.json(data);
  } catch (error) {
    console.error('Error fetching catalog item form:', error);
    res.status(500).json({ error: 'Failed to fetch catalog item form', message: error.message });
  }
});

// Get catalog categories
app.get('/api/servicenow/catalog/categories', async (req, res) => {
  try {
    // Fetch all active catalog categories with display values
    const endpoint = `/api/now/table/sc_category?sysparm_query=active=true&sysparm_fields=sys_id,title,description&sysparm_display_value=true&sysparm_limit=100`;
    
    const data = await makeServiceNowRequest(endpoint);
    res.json(data);
  } catch (error) {
    console.error('Error fetching catalog categories:', error);
    res.status(500).json({ error: 'Failed to fetch catalog categories', message: error.message });
  }
});

// Get knowledge articles
app.get('/api/servicenow/knowledge/articles', async (req, res) => {
  try {
    const { search, category, limit = 10, offset = 0 } = req.query;
    
    let query = 'workflow_state=published^active=true';
    if (search) {
      query += `^short_descriptionLIKE${search}^ORtextLIKE${search}`;
    }
    if (category) {
      query += `^kb_category=${category}`;
    }
    
    const endpoint = `/api/now/table/kb_knowledge?sysparm_query=${encodeURIComponent(query)}&sysparm_limit=${limit}&sysparm_offset=${offset}&sysparm_fields=sys_id,short_description,text,number,kb_category,sys_created_on,sys_updated_on`;
    
    const data = await makeServiceNowRequest(endpoint);
    res.json(data);
  } catch (error) {
    console.error('Error fetching knowledge articles:', error);
    res.status(500).json({ error: 'Failed to fetch knowledge articles', message: error.message });
  }
});

// Get knowledge article details
app.get('/api/servicenow/knowledge/articles/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    const endpoint = `/api/now/table/kb_knowledge/${articleId}`;
    
    const data = await makeServiceNowRequest(endpoint);
    res.json(data);
  } catch (error) {
    console.error('Error fetching knowledge article details:', error);
    res.status(500).json({ error: 'Failed to fetch knowledge article details', message: error.message });
  }
});

// Submit catalog request
app.post('/api/servicenow/catalog/requests', async (req, res) => {
  try {
    const { itemId, formData } = req.body;
    
    // Create the request
    const requestData = {
      cat_item: itemId,
      quantity: 1,
      variables: formData
    };
    
    const endpoint = '/api/now/table/sc_request';
    const data = await makeServiceNowRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
    
    res.json(data);
  } catch (error) {
    console.error('Error submitting catalog request:', error);
    res.status(500).json({ error: 'Failed to submit catalog request', message: error.message });
  }
});

// Get user requests
app.get('/api/servicenow/requests', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    const endpoint = `/api/now/table/sc_request?sysparm_limit=${limit}&sysparm_offset=${offset}&sysparm_fields=sys_id,number,short_description,state,opened_at,sys_created_on,requested_for`;
    
    const data = await makeServiceNowRequest(endpoint);
    res.json(data);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ error: 'Failed to fetch user requests', message: error.message });
  }
});

// Test ServiceNow connection
app.get('/api/servicenow/test', async (req, res) => {
  try {
    const endpoint = '/api/now/table/sys_user?sysparm_limit=1';
    const data = await makeServiceNowRequest(endpoint);
    res.json({ status: 'Connected', message: 'ServiceNow API is accessible', data });
  } catch (error) {
    console.error('ServiceNow connection test failed:', error);
    res.status(500).json({ status: 'Failed', message: 'Unable to connect to ServiceNow', error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error', message: error.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ServiceNow Proxy Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 ServiceNow test: http://localhost:${PORT}/api/servicenow/test`);
  console.log(`🌐 CORS enabled for: ${corsOptions.origin.join(', ')}`);
});

module.exports = app;