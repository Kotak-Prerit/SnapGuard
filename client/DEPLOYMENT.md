# SnapGuard Client - Vercel Deployment Guide

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Navigate to client directory**

   ```bash
   cd client
   ```

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. **Push your code to GitHub repository**

2. **Connect to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Select the `client` folder as the root directory

3. **Configure build settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## 🔧 Environment Variables

Set these environment variables in your Vercel dashboard:

```
VITE_SUPABASE_URL=https://fjcvpcunhxsxzhgsndoo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqY3ZwY3VuaHhzeHpoZ3NuZG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NzIwMjUsImV4cCI6MjA2NTQ0ODAyNX0.7i0S3YXLxOOjjkRnDDolL9l4zPlNf-T3-zplZ6kt-Bc
VITE_GROQ_API=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
```

## 🔄 API Configuration

The client is configured to proxy API requests to your Render server:

- Development: Uses Vite proxy to `https://snapgaurd.onrender.com`
- Production: Uses Vercel rewrites to proxy `/api/*` requests to your server

## 📁 Project Structure

```
client/
├── vercel.json          # Vercel configuration
├── vite.config.ts       # Vite configuration with proxy
├── package.json         # Dependencies and scripts
├── dist/               # Build output (auto-generated)
└── src/                # Source code
```

## ✅ Build Verification

The build process has been tested and generates:

- `dist/index.html` - Main HTML file
- `dist/assets/` - Optimized CSS and JS files
- Total bundle size: ~823KB (250KB gzipped)

## 🌐 Domain Configuration

After deployment, you can:

1. Use the default Vercel domain (e.g., `snapguard-client.vercel.app`)
2. Configure a custom domain in Vercel dashboard
3. Set up DNS records for your custom domain

## 🔍 Troubleshooting

### Common Issues:

1. **Environment Variables Not Working**

   - Make sure variables start with `VITE_`
   - Redeploy after adding environment variables

2. **API Requests Failing**

   - Verify your Render server is running
   - Check API endpoints are correct

3. **Build Failures**
   - Run `npm run build` locally first
   - Check for TypeScript errors
   - Ensure all dependencies are installed

### Useful Commands:

```bash
# Test build locally
npm run build

# Preview production build
npm run preview

# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]
```

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Ensure your Render server is accessible
4. Test API endpoints manually

---

**Status**: ✅ Ready for deployment
**Server**: https://snapgaurd.onrender.com (Live)
**Client**: Ready to deploy to Vercel
