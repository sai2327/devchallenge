# DevChallenge - Coding Challenge Tracker

A collaborative platform for tracking coding challenges and competing with friends.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sai2327/devchallenge)

### Prerequisites
1. **Supabase Account** (FREE) - [Sign up here](https://supabase.com/)
2. **Vercel Account** (FREE) - [Sign up here](https://vercel.com/)

### Deployment Steps

#### 1. Set Up Supabase (5 minutes)
Follow the detailed guide: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

Quick summary:
- Create new project at [supabase.com](https://supabase.com/)
- Copy Project URL and anon key
- Run the SQL schema (provided in setup guide)
- Create storage buckets: `avatars` and `documents`

#### 2. Deploy to Vercel (2 minutes)
1. Click the "Deploy" button above
2. Connect your GitHub account
3. Add environment variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
4. Click **Deploy**
5. Wait 2-3 minutes
6. Get your live URL! 🎉

## 🔧 Local Development

```bash
# Clone the repository
git clone https://github.com/sai2327/devchallenge.git
cd devchallenge

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Supabase credentials to .env.local
# VITE_SUPABASE_URL=your_url_here
# VITE_SUPABASE_ANON_KEY=your_key_here

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✨ Features

- 🔐 **Authentication** - Email, Google, GitHub, Microsoft OAuth
- 👥 **Groups** - Create private/public coding groups
- 🏆 **Challenges** - Track coding challenges across platforms
- 📊 **Leaderboards** - Compete with friends
- 📈 **Stats Dashboard** - Visualize your progress
- 🌙 **Dark Mode** - Easy on the eyes
- 📱 **Responsive** - Works on all devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **Charts**: Recharts
- **Validation**: Zod + React Hook Form

## 📚 Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md) - Complete backend setup
- [Environment Variables](./.env.example) - Configuration template

## 🌐 Supported Coding Platforms

- LeetCode
- CodeChef
- HackerRank
- Codeforces

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project for learning or personal use!

## 💡 Need Help?

- Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup instructions
- Open an issue on GitHub

## 🎉 Free Hosting!

Both Supabase and Vercel offer generous free tiers:
- **Supabase Free**: 500MB database, 1GB storage, 50K users
- **Vercel Free**: Unlimited deployments, 100GB bandwidth

Perfect for personal projects and sharing with friends! 🚀
