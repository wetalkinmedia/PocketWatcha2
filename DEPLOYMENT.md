# Automatic Deployment Setup for pocketwatcha.com

This guide will help you set up automatic deployments so your site updates whenever you push code changes.

## Prerequisites

- Your code in a GitHub repository
- Access to pocketwatcha.com domain settings

## Option 1: Netlify (Recommended - Easiest)

### Initial Setup

1. **Sign up at [Netlify](https://netlify.com)** with your GitHub account

2. **Import your repository:**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and authorize Netlify
   - Select your repository
   - Build settings are already configured in `netlify.toml`

3. **Add environment variables:**
   - Go to Site settings → Environment variables
   - Add these variables:
     - `VITE_SUPABASE_URL` = (your Supabase URL)
     - `VITE_SUPABASE_ANON_KEY` = (your Supabase anon key)

4. **Set up custom domain:**
   - Go to Domain settings → Add custom domain
   - Enter `pocketwatcha.com`
   - Update your domain DNS:
     - Add CNAME record: `www` → `your-site.netlify.app`
     - Add A record: `@` → Netlify's IP (shown in settings)

5. **Enable automatic deployments:**
   - Already configured! Every push to `main` branch auto-deploys

### Deploy Now
```bash
git add .
git commit -m "Add AI transition course"
git push origin main
```

Netlify will automatically build and deploy in 2-3 minutes.

---

## Option 2: Vercel

### Initial Setup

1. **Sign up at [Vercel](https://vercel.com)** with your GitHub account

2. **Import your repository:**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Build settings are auto-detected from `vercel.json`

3. **Add environment variables:**
   - Go to Project Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` = (your Supabase URL)
     - `VITE_SUPABASE_ANON_KEY` = (your Supabase anon key)
   - Apply to: Production, Preview, Development

4. **Set up custom domain:**
   - Go to Project Settings → Domains
   - Add `pocketwatcha.com`
   - Follow DNS instructions (usually CNAME)

5. **Enable automatic deployments:**
   - Already enabled by default!
   - Every push auto-deploys

### Deploy Now
```bash
git add .
git commit -m "Add AI transition course"
git push origin main
```

Vercel will automatically deploy in 1-2 minutes.

---

## Option 3: GitHub Pages + Custom Domain

### Initial Setup

1. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: GitHub Actions

2. **Add environment secrets:**
   - Go to Settings → Secrets and variables → Actions
   - Add repository secrets:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

3. **Configure custom domain:**
   - In Pages settings, add custom domain: `pocketwatcha.com`
   - Update your domain DNS:
     - Add CNAME record: `www` → `your-username.github.io`
     - Add A records for apex domain:
       - `185.199.108.153`
       - `185.199.109.153`
       - `185.199.110.153`
       - `185.199.111.153`

4. **Enable automatic deployments:**
   - Already configured in `.github/workflows/deploy.yml`
   - Runs on every push to main

### Deploy Now
```bash
git add .
git commit -m "Add AI transition course"
git push origin main
```

Check the "Actions" tab on GitHub to see deployment progress.

---

## Verifying Your Deployment

After deployment, verify the course is live:

1. Visit `https://pocketwatcha.com`
2. Click "AI Courses" button in the header
3. Look for "Transitioning to AI: White Collar & Blue Collar Guide"
4. The course should display with:
   - Price: $299.99 (was $499.99)
   - 4.9 rating
   - 25,000+ students
   - 4 modules with interactive lessons

---

## Troubleshooting

### Course not showing?
- **Clear browser cache:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- **Check deployment logs:** Verify build succeeded without errors
- **Check environment variables:** Ensure Supabase keys are set correctly

### Build failing?
- **Check Node version:** Should be 18 or higher
- **Verify dependencies:** Run `npm install` locally first
- **Check logs:** Review build logs in your hosting platform

### Domain not working?
- **DNS propagation:** Can take 24-48 hours
- **Check DNS settings:** Use [DNS Checker](https://dnschecker.org)
- **SSL certificate:** Most hosts auto-provision (allow 10-15 minutes)

---

## Quick Commands

```bash
# Check if everything builds locally
npm run build

# Preview production build locally
npm run preview

# Commit and deploy
git add .
git commit -m "Your commit message"
git push origin main
```

---

## Deployment Status

You can monitor deployments at:
- **Netlify:** https://app.netlify.com
- **Vercel:** https://vercel.com/dashboard
- **GitHub Pages:** Repository → Actions tab

---

## Next Steps

Once deployed, your site will automatically update whenever you:
1. Push code to the main branch
2. Merge a pull request
3. Make changes through GitHub web interface

The "Transitioning to AI: White Collar & Blue Collar Guide" course is now part of your production site!
