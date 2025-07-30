# ServiceNow External Portal Server

A Node.js/Express server that acts as a proxy between the ServiceNow External Portal frontend and ServiceNow APIs, solving CORS restrictions and handling authentication securely.

## 🚀 Quick Start

### Local Development

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd servicenow-external-portal-server
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your ServiceNow credentials
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Test Connection**
   ```bash
   curl http://localhost:3001/api/servicenow/test
   ```

### Production Deployment

#### Deploy to Heroku

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set SERVICENOW_BASE_URL=https://your-instance.service-now.com
   heroku config:set SERVICENOW_USERNAME=your-username
   heroku config:set SERVICENOW_PASSWORD=your-password
   heroku config:set FRONTEND_URL=https://hosenagbaria.github.io
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

#### Deploy to Railway

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repository
   - Add environment variables in the dashboard

#### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SERVICENOW_BASE_URL` | Your ServiceNow instance URL | ✅ |
| `SERVICENOW_USERNAME` | ServiceNow username | ✅ |
| `SERVICENOW_PASSWORD` | ServiceNow password | ✅ |
| `SERVICENOW_CLIENT_ID` | OAuth client ID (optional) | ❌ |
| `SERVICENOW_CLIENT_SECRET` | OAuth client secret (optional) | ❌ |
| `PORT` | Server port (default: 3001) | ❌ |
| `FRONTEND_URL` | Frontend URL for CORS | ✅ |
| `NODE_ENV` | Environment (development/production) | ❌ |

### CORS Configuration

The server automatically allows requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)
- `https://hosenagbaria.github.io` (GitHub Pages)
- Custom URL from `FRONTEND_URL` environment variable

## 📡 API Endpoints

### Health Check
- `GET /health` - Server health status

### ServiceNow Proxy
- `GET /api/servicenow/test` - Test ServiceNow connection
- `GET /api/servicenow/catalog/items` - Get catalog items
- `GET /api/servicenow/catalog/items/:id` - Get catalog item details
- `GET /api/servicenow/knowledge/articles` - Get knowledge articles
- `GET /api/servicenow/knowledge/articles/:id` - Get article details
- `POST /api/servicenow/catalog/requests` - Submit catalog request
- `GET /api/servicenow/requests` - Get user requests

### Query Parameters

#### Catalog Items
- `search` - Search term
- `category` - Filter by category
- `limit` - Number of results (default: 10)
- `offset` - Pagination offset (default: 0)

#### Knowledge Articles
- `search` - Search term
- `category` - Filter by category
- `limit` - Number of results (default: 10)
- `offset` - Pagination offset (default: 0)

## 🔒 Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **CORS Protection** - Restricted to allowed origins
- **Input Validation** - Request validation and sanitization
- **Error Handling** - Secure error responses

## 🛠️ Development

### Scripts

```bash
npm start      # Start production server
npm run dev    # Start development server with nodemon
npm test       # Run tests (placeholder)
```

### Testing the Server

1. **Health Check**
   ```bash
   curl http://localhost:3001/health
   ```

2. **ServiceNow Connection**
   ```bash
   curl http://localhost:3001/api/servicenow/test
   ```

3. **Catalog Items**
   ```bash
   curl "http://localhost:3001/api/servicenow/catalog/items?limit=5"
   ```

## 🔗 Frontend Integration

Update your frontend's API service to use the server URL:

```javascript
// In your frontend .env file
VITE_API_BASE_URL=https://your-server-url.herokuapp.com

// In your API service
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
```

## 📝 Logs

The server logs:
- All API requests and responses
- ServiceNow connection status
- Error details for debugging
- Rate limiting events

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` is set correctly
   - Check that your frontend URL is in the CORS whitelist

2. **ServiceNow Connection Failed**
   - Verify ServiceNow credentials
   - Check ServiceNow instance URL
   - Ensure ServiceNow user has API access

3. **Rate Limiting**
   - Default: 100 requests per 15 minutes
   - Adjust in `server.js` if needed

4. **Authentication Errors**
   - Check username/password combination
   - Verify user permissions in ServiceNow

### Debug Mode

Set `NODE_ENV=development` for detailed logging:

```bash
NODE_ENV=development npm start
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues related to:
- **Server setup**: Check this README and logs
- **ServiceNow configuration**: Contact your ServiceNow administrator
- **Deployment**: Refer to platform-specific documentation