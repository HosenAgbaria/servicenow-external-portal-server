# ServiceNow External Portal Server - Deployment Guide

## Overview

This server acts as a proxy between your frontend application and ServiceNow APIs, solving CORS issues and handling authentication securely.

## Quick Setup

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository named `servicenow-external-portal-server`
2. Make it public or private (your choice)
3. Don't initialize with README (we'll push our files)

### 2. Upload Files to GitHub

```bash
cd server-repo
git init
git add .
git commit -m "Initial server setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/servicenow-external-portal-server.git
git push -u origin main
```

### 3. Deploy to Heroku (Recommended)

#### Option A: Deploy from GitHub (Easiest)

1. Go to [Heroku Dashboard](https://dashboard.heroku.com)
2. Click "New" → "Create new app"
3. Choose app name: `your-servicenow-proxy` (or any available name)
4. Select region
5. In "Deployment method", choose "GitHub"
6. Connect your GitHub account and select the repository
7. Enable "Automatic deploys" from main branch
8. Go to "Settings" → "Config Vars" and add:
   ```
   SERVICENOW_BASE_URL=https://tanivdynamicsltddemo4.service-now.com
   SERVICENOW_USERNAME=ext.portal.v2
   SERVICENOW_PASSWORD=*]<D7sP^KX+zW1Nn.VJ6P,(w=-$5QJ
   FRONTEND_URL=https://YOUR_GITHUB_USERNAME.github.io
   NODE_ENV=production
   ```
9. Click "Deploy Branch" in the Deploy tab

#### Option B: Deploy with Heroku CLI

```bash
# Install Heroku CLI first
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-servicenow-proxy

# Set environment variables
heroku config:set SERVICENOW_BASE_URL=https://tanivdynamicsltddemo4.service-now.com
heroku config:set SERVICENOW_USERNAME=ext.portal.v2
heroku config:set SERVICENOW_PASSWORD="*]<D7sP^KX+zW1Nn.VJ6P,(w=-$5QJ"
heroku config:set FRONTEND_URL=https://YOUR_GITHUB_USERNAME.github.io
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### 4. Alternative Deployment Options

#### Railway

1. Go to [Railway](https://railway.app)
2. Connect GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy automatically

#### Vercel

1. Go to [Vercel](https://vercel.com)
2. Import GitHub repository
3. Add environment variables
4. Deploy

#### Render

1. Go to [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Add environment variables
5. Deploy

### 5. Update Frontend Configuration

After deploying your server, update your frontend's `.env` file:

```env
# Replace with your deployed server URL
VITE_API_BASE_URL=https://your-servicenow-proxy.herokuapp.com
```

Then redeploy your frontend to GitHub Pages.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|----------|
| `SERVICENOW_BASE_URL` | Your ServiceNow instance URL | `https://your-instance.service-now.com` |
| `SERVICENOW_USERNAME` | ServiceNow username | `ext.portal.v2` |
| `SERVICENOW_PASSWORD` | ServiceNow password | `your-password` |
| `SERVICENOW_CLIENT_ID` | OAuth Client ID (optional) | `abc123...` |
| `SERVICENOW_CLIENT_SECRET` | OAuth Client Secret (optional) | `xyz789...` |
| `FRONTEND_URL` | Your frontend URL for CORS | `https://username.github.io` |
| `PORT` | Server port (auto-set by hosting) | `3001` |
| `NODE_ENV` | Environment | `production` |

## Testing Your Deployment

1. Visit your server URL: `https://your-app.herokuapp.com/health`
2. You should see: `{"status":"OK","timestamp":"..."}`
3. Test ServiceNow connection: `https://your-app.herokuapp.com/test-connection`
4. Update your frontend and test the full application

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure `FRONTEND_URL` matches your GitHub Pages URL exactly
2. **Authentication Errors**: Verify ServiceNow credentials in environment variables
3. **Server Not Starting**: Check Heroku logs with `heroku logs --tail`
4. **API Errors**: Test individual endpoints and check server logs

### Checking Logs

```bash
# Heroku
heroku logs --tail --app your-app-name

# Railway
# Check logs in Railway dashboard

# Vercel
# Check logs in Vercel dashboard
```

## Security Notes

- Never commit `.env` files with real credentials
- Use environment variables for all sensitive data
- The server includes rate limiting and security headers
- CORS is configured to only allow your frontend domain

## Next Steps

1. Deploy the server using one of the methods above
2. Update your frontend's `VITE_API_BASE_URL`
3. Redeploy your frontend
4. Test the complete application
5. Monitor server logs for any issues

## Support

If you encounter issues:

1. Check the server logs
2. Verify environment variables
3. Test individual API endpoints
4. Ensure ServiceNow credentials are correct
5. Check CORS configuration

Your ServiceNow External Portal should now work without CORS issues! 🎉