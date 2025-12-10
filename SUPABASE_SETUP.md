# Supabase Setup Guide

This guide will help you set up Supabase for the DevChallenge application.

## Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com/)
2. Click "Start your project" or "Sign up"
3. Sign in with GitHub (recommended) or email

## Step 2: Create a New Project

1. Click "New Project"
2. Fill in the details:
   - **Name**: DevChallenge (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
3. Click "Create new project"
4. Wait 1-2 minutes for the project to be provisioned

## Step 3: Get Your Project Credentials

1. In your Supabase dashboard, go to **Project Settings** (gear icon)
2. Click on **API** in the left sidebar
3. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 4: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 5: Set Up Database Tables

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy and paste this SQL schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  photo_url TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  coding_profiles JSONB DEFAULT '{"leetcode": "", "codechef": "", "hackerrank": "", "codeforces": ""}'::jsonb,
  friends TEXT[] DEFAULT ARRAY[]::TEXT[],
  groups TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Groups table
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  admin_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  members TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenges table
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  platform TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES users(id),
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge Progress table
CREATE TABLE challenge_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not-started',
  submitted_at TIMESTAMPTZ,
  proof_url TEXT,
  notes TEXT,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

-- Leaderboard table
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total_score INTEGER DEFAULT 0,
  challenges_completed INTEGER DEFAULT 0,
  challenges_attempted INTEGER DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Indexes for better performance
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_groups_created_by ON groups(created_by);
CREATE INDEX idx_challenges_group_id ON challenges(group_id);
CREATE INDEX idx_challenge_progress_challenge_id ON challenge_progress(challenge_id);
CREATE INDEX idx_challenge_progress_user_id ON challenge_progress(user_id);
CREATE INDEX idx_leaderboard_group_id ON leaderboard(group_id);
CREATE INDEX idx_leaderboard_user_id ON leaderboard(user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Groups policies
CREATE POLICY "Anyone can view public groups" ON groups FOR SELECT USING (is_private = false OR auth.uid()::text = ANY(members));
CREATE POLICY "Members can view private groups" ON groups FOR SELECT USING (auth.uid()::text = ANY(members));
CREATE POLICY "Users can create groups" ON groups FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admins can update groups" ON groups FOR UPDATE USING (auth.uid()::text = ANY(admin_ids));
CREATE POLICY "Admins can delete groups" ON groups FOR DELETE USING (auth.uid()::text = ANY(admin_ids));

-- Challenges policies
CREATE POLICY "Group members can view challenges" ON challenges FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM groups 
    WHERE groups.id = challenges.group_id 
    AND auth.uid()::text = ANY(groups.members)
  )
);
CREATE POLICY "Group admins can create challenges" ON challenges FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM groups 
    WHERE groups.id = group_id 
    AND auth.uid()::text = ANY(groups.admin_ids)
  )
);
CREATE POLICY "Group admins can update challenges" ON challenges FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM groups 
    WHERE groups.id = challenges.group_id 
    AND auth.uid()::text = ANY(groups.admin_ids)
  )
);
CREATE POLICY "Group admins can delete challenges" ON challenges FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM groups 
    WHERE groups.id = challenges.group_id 
    AND auth.uid()::text = ANY(groups.admin_ids)
  )
);

-- Challenge Progress policies
CREATE POLICY "Users can view all progress in their groups" ON challenge_progress FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM challenges c
    JOIN groups g ON g.id = c.group_id
    WHERE c.id = challenge_progress.challenge_id
    AND auth.uid()::text = ANY(g.members)
  )
);
CREATE POLICY "Users can insert own progress" ON challenge_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON challenge_progress FOR UPDATE USING (auth.uid() = user_id);

-- Leaderboard policies
CREATE POLICY "Group members can view leaderboard" ON leaderboard FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM groups 
    WHERE groups.id = leaderboard.group_id 
    AND auth.uid()::text = ANY(groups.members)
  )
);
CREATE POLICY "System can update leaderboard" ON leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update leaderboard entries" ON leaderboard FOR UPDATE USING (true);
```

4. Click **Run** (or press Ctrl+Enter)

## Step 6: Set Up Storage Buckets

1. In Supabase dashboard, click **Storage** (left sidebar)
2. Click "Create a new bucket"
3. Create two buckets:

   **Bucket 1: avatars**
   - Name: `avatars`
   - Public: ✅ Enable
   - File size limit: 2 MB
   - Allowed MIME types: `image/*`

   **Bucket 2: documents**
   - Name: `documents`
   - Public: ✅ Enable
   - File size limit: 10 MB
   - Allowed MIME types: `image/*,application/pdf`

## Step 7: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable the providers you want to use:

### Email Authentication (Enabled by default)
- Already enabled ✅

### Google OAuth (Optional but recommended)
1. Click on **Google**
2. Enable the provider
3. Follow the instructions to:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth credentials
   - Copy Client ID and Client Secret to Supabase
4. Add your domain to authorized redirect URIs

### GitHub OAuth (Optional)
1. Click on **GitHub**
2. Enable the provider
3. Follow instructions to create GitHub OAuth App
4. Copy Client ID and Client Secret to Supabase

### Other Providers (Azure, LinkedIn, etc.)
- Follow similar steps for Microsoft/Azure and LinkedIn if needed

## Step 8: Configure Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your deployment URL:
   - For development: `http://localhost:3000`
   - For production: `https://your-app.vercel.app` (after deployment)
3. Add redirect URLs:
   - `http://localhost:3000/**`
   - `https://your-app.vercel.app/**`

## Step 9: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000
3. Try to sign up with email or OAuth
4. Check that your profile is created in the `users` table

## Step 10: Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com/)
3. Import your GitHub repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

## Troubleshooting

### Issue: "Invalid API key"
- Double-check your `.env.local` file
- Make sure you copied the **anon** key, not the service_role key
- Restart your dev server after changing `.env.local`

### Issue: Authentication not working
- Check that you've enabled the provider in Supabase Authentication settings
- Verify Site URL and Redirect URLs are correct
- For OAuth: Ensure you've configured the provider's OAuth app correctly

### Issue: Database operations failing
- Check that you've run the SQL schema in Step 5
- Verify Row Level Security policies are correctly set up
- Check browser console for detailed error messages

### Issue: Storage upload failing
- Ensure storage buckets are created and public
- Check file size limits
- Verify MIME types are allowed

## Next Steps

- ✅ **Email me when users sign up**: Set up email templates in Authentication → Email Templates
- ✅ **Custom domain**: Add a custom domain in Project Settings
- ✅ **Monitor usage**: Check your project's usage in the dashboard
- ✅ **Backup**: Enable automatic backups (paid plans)

## Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

## Free Tier Limits

Supabase's free tier includes:
- 500 MB database space
- 1 GB file storage
- 50,000 monthly active users
- 2 GB bandwidth

Perfect for getting started and small projects!
