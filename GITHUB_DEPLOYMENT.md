# Deploy Healthcare Chatbot from GitHub

Your code is already pushed to: https://github.com/nkaluva9/healthcare-chatbot

## Step 1: Add Environment Variables to GitHub

1. Go to your repository: https://github.com/nkaluva9/healthcare-chatbot
2. Click **Settings** tab (top menu)
3. In left sidebar, click **Secrets and variables** → **Actions**
4. Click **"New repository secret"** button

Add these 3 secrets:

**Secret 1:**
- Name: `VITE_SUPABASE_URL`
- Value: Your Supabase project URL

**Secret 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: Your Supabase anonymous key

**Secret 3:**
- Name: `VITE_DIRECT_LINE_SECRET`
- Value: Your Azure Bot Direct Line secret

## Step 2: Enable GitHub Pages

1. In your repository, go to **Settings** tab
2. In left sidebar, click **Pages**
3. Under "Build and deployment":
   - Source: Select **"GitHub Actions"**
4. Click **Save**

## Step 3: Push the Deployment Files

Run these commands on your computer:

```bash
cd path/to/healthcare-chatbot
git pull origin main
git add .
git commit -m "Add GitHub Actions deployment"
git push origin main
```

## Step 4: Watch the Deployment

1. Go to **Actions** tab in your repository
2. You'll see "Deploy to GitHub Pages" workflow running
3. Wait 2-3 minutes for it to complete
4. Once done, your site will be live at:

   **https://nkaluva9.github.io/healthcare-chatbot/**

## Automatic Updates

From now on, every time you push to the `main` branch, GitHub will automatically:
- Build your app
- Deploy to GitHub Pages
- Update your live site

## Troubleshooting

**Build fails?**
- Check that all 3 secrets are added correctly in Settings → Secrets and variables → Actions
- Make sure secret names match exactly (case-sensitive)

**Page shows 404?**
- Wait 5 minutes after first deployment
- Check Settings → Pages shows "Your site is live at..."

**Need help?**
Just let me know which step you're on!
