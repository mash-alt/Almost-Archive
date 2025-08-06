# 📚 Almost Archive

A nostalgic story submission and archive platform where memories find their voice and thoughts settle like dust on old photographs.

## ✨ Overview

Almost Archive is a React-based web application that allows users to submit and browse personal stories with an analog, nostalgic aesthetic. Built with modern web technologies and Firebase for data persistence.

## 🎨 Features

### 📖 Story Management
- **Story Submission**: Rich markdown editor with real-time preview
- **Story Archive**: Browse stories with filtering, sorting, and pagination
- **Full Story View**: Individual story pages with comments and reactions

### 🎭 Mood & Reactions System
- **Mood Classification**: Each story tagged with emotional moods (heartbroken, nostalgic, hopeful, etc.)
- **Reader Reactions**: Users can react to stories (limited to one reaction per user via localStorage)
- **Visual Mood Indicators**: Color-coded mood system with emojis

### 🔍 Discovery Features  
- **Smart Search**: Search by title, content, author, or tags
- **Filter by Mood**: Filter stories by emotional tone
- **Tag-based Filtering**: Discover stories by topics/themes
- **Multiple Sorting**: Sort by newest, oldest, most-read, or most-reacted

### 💬 Community Features
- **Comment System**: Readers can leave supportive comments
- **View Tracking**: Smart view counting (one per user via localStorage)
- **Anonymous Support**: No login required - fully anonymous experience

### 🎯 User Experience
- **Analog Aesthetic**: Vintage typewriter fonts, sepia tones, paper textures
- **Responsive Design**: Mobile-friendly with paper card animations
- **Accessibility**: Proper ARIA labels, keyboard navigation
- **Loading States**: Beautiful loading and error state handling

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript for type-safe development
- **React Router DOM** for client-side routing
- **Vite** for fast development and building
- **CSS3** with custom properties for theming

### Backend & Data
- **Firebase Firestore** for real-time database
- **Firebase Hosting** ready for deployment

### Content & Formatting
- **react-markdown** with remark-gfm for GitHub Flavored Markdown support
- **Custom CSS** for analog nostalgic styling

### Development Tools
- **ESLint** for code quality
- **TypeScript** for type safety
- **Git** for version control

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "Almost Archive"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Copy your Firebase config

4. **Environment setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

5. **Populate sample data** (optional)
   ```bash
   cd src/scripts
   npm install
   npm run populate
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.tsx      # Site navigation
│   ├── Footer.tsx      # Site footer
│   └── SubmitStory.tsx # Story submission form
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── About.tsx       # About page
│   ├── Archive.tsx     # Story listing with filters
│   └── StoryDetail.tsx # Individual story view
├── styles/             # CSS stylesheets
│   ├── App.css         # Global styles
│   ├── Header.css      # Header styling
│   └── Footer.css      # Footer styling
├── scripts/            # Utility scripts
│   └── populateFirestore.ts # Sample data population
├── types.ts            # TypeScript type definitions
├── firebaseConfig.ts   # Firebase configuration
└── main.tsx           # App entry point
```

## 🎨 Design System

### Color Palette
- **Cream**: `#f7f1e3` - Background
- **Paper White**: `#fefcf3` - Cards and content
- **Light Brown**: `#d4c4a8` - Borders and secondary elements  
- **Medium Brown**: `#6b4e3d` - Text and accents
- **Dark Brown**: `#3d2914` - Primary text
- **Gold**: `#d4a574` - Highlights and CTAs

### Typography
- **Special Elite**: Monospace typewriter font for headings
- **Playfair Display**: Serif font for body text and elegance
- **Courier New**: Monospace for code snippets

### Visual Elements
- Paper texture backgrounds
- Subtle card rotations and shadows
- Smooth hover animations
- Sepia-toned aesthetic
- Vintage-inspired iconography

## 📝 Usage

### Submitting a Story
1. Click "write" in the navigation
2. Fill out the story form with title, content (Markdown supported), author, and tags
3. Select a mood that matches your story
4. Preview your story using the tab system
5. Submit to add to the archive

### Browsing Stories  
1. Visit the "archive" page
2. Use search to find specific content
3. Filter by mood or tags using the filter panel
4. Sort by newest, oldest, most-read, or most-reacted
5. Click any story card to read the full content

### Interacting with Stories
1. Read full stories on individual story pages
2. React with emotions (one per story per user)
3. Leave supportive comments
4. Click tags to filter the archive

## 🚀 Deployment

### Automatic Deployment with GitHub Actions

The project includes automated deployment to Firebase Hosting via GitHub Actions. Every push to the `main` branch will automatically build and deploy the site.

#### Setup Instructions:

1. **Generate Firebase Service Account Key**
   ```bash
   # Install Firebase CLI (if not already installed)
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Generate service account key
   firebase projects:list
   firebase projects:addfirebase PROJECT_ID
   ```

2. **Add GitHub Secrets**
   
   Go to your repository's Settings → Secrets and variables → Actions, and add these secrets:

   **Firebase Configuration:**
   - `VITE_FIREBASE_API_KEY`: Your Firebase API key
   - `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain  
   - `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
   - `VITE_FIREBASE_APP_ID`: Your Firebase app ID
   - `VITE_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID

   **App Configuration:**
   - `VITE_APP_NAME`: "Almost Archive"
   - `VITE_APP_URL`: Your production URL (e.g., https://almost-archive.web.app)
   - `VITE_APP_ENVIRONMENT`: "production"

   **Firebase Service Account:**
   - `FIREBASE_SERVICE_ACCOUNT_ALMOST_ARCHIVE`: Your Firebase service account JSON (base64 encoded)

3. **Get Firebase Service Account Key**
   ```bash
   # Create service account
   firebase projects:addfirebase almost-archive
   
   # Download the service account key
   # Go to Firebase Console → Project Settings → Service Accounts
   # Generate new private key and download the JSON file
   # Copy the entire JSON content as the secret value
   ```

4. **Push to Deploy**
   ```bash
   git add .
   git commit -m "Setup automated deployment"
   git push origin main
   ```

### Manual Firebase Deployment
```bash
# Build the project
npm run build

# Deploy manually (if needed)
firebase deploy
```

### Other Platforms
The built `dist/` folder can be deployed to:
- Vercel
- Netlify  
- GitHub Pages
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 TODO / Future Features

- [ ] User authentication system
- [ ] Story editing/deletion by authors
- [ ] Advanced search with filters
- [ ] Story sharing functionality
- [ ] Email notifications for new comments
- [ ] Story categories/collections
- [ ] Reading time estimates
- [ ] Story bookmarking
- [ ] Admin moderation panel
- [ ] Story analytics dashboard

## 🐛 Known Issues

- None currently reported

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by analog photography and vintage correspondence
- Firebase for reliable backend infrastructure
- React and Vite communities for excellent developer experience
- Google Fonts for beautiful typography options

---

**Built with ❤️ for sharing stories and preserving memories**

*"Where memories find their voice and thoughts settle like dust on old photographs"*
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
