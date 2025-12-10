# DevChallenge - Competitive Programming Social Platform

A modern web application built with React, Firebase, and TailwindCSS for competitive programmers to track progress, create challenges, and compete with friends.

## 🚀 Features

- **Authentication**: Google, GitHub, LinkedIn, Microsoft OAuth + Email/Password
- **Coding Stats**: Track LeetCode, CodeChef, HackerRank, CodeForces progress
- **Groups & Challenges**: Create groups, set challenges, and compete
- **Real-time Leaderboard**: Live ranking updates
- **Profile Management**: Customize profile with avatar, bio, and coding profiles
- **Dark Mode**: Toggle between light and dark themes

## 🛠️ Tech Stack

- **Frontend**: React 18+ with Hooks
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **State Management**: Context API + Zustand
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Charts**: Recharts

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd devchallenge
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Add your Firebase configuration to `.env.local`

5. Start the development server:
```bash
npm run dev
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔥 Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Google, GitHub, LinkedIn, Microsoft, Email/Password)
3. Create Firestore Database
4. Enable Cloud Storage
5. Copy your Firebase config to `.env.local`

### Firestore Collections Structure:

```
users/
  {userId}/
    displayName, email, photoURL, phone, bio, createdAt
    codingProfiles: { leetcode, codechef, hackerrank, codeforces }
    friends: [userId1, userId2, ...]
    groups: [groupId1, groupId2, ...]

groups/
  {groupId}/
    name, description, createdBy, createdAt
    members: [userId1, userId2, ...]
    challenges: [challengeId1, challengeId2, ...]

challenges/
  {challengeId}/
    groupId, title, description, deadline, createdBy, createdAt
    completedBy: [userId1, userId2, ...]

leaderboard/
  {groupId}/
    rankings: [{ userId, points, challengesCompleted, rank }, ...]
    lastUpdated
```

## 🎨 Design System

### Colors:
- Primary: `#2180A8`
- Secondary: `#32B8C6`
- Success: `#22C55E`
- Error: `#C0152F`
- Warning: `#E67F47`
- Info: `#3B82F6`

### Typography:
- Font: Inter (Google Fonts)

## 📱 Pages

- `/login` - Authentication page
- `/` - Home dashboard
- `/stats` - Coding statistics hub
- `/profile` - User profile view
- `/profile/edit` - Edit profile
- `/challenges` - Groups hub
- `/group/:groupId` - Group detail view
- `/leaderboard/:groupId` - Full leaderboard

## 🚀 Deployment

### Deploy to Vercel:
```bash
npm install -g vercel
vercel
```

### Deploy to Firebase Hosting:
```bash
npm run build
firebase deploy
```

### Deploy to Netlify:
```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

## 📄 License

MIT License

## 👥 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📞 Support

For support, email support@devchallenge.com or open an issue on GitHub.

---

Built with ❤️ by the DevChallenge Team
