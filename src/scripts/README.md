# Firestore Population Script

This script populates your Firestore database with sample data to get you started with Almost Archive.

## What it creates:

### 📝 Stories Collection
- 5 sample stories with different moods and emotions
- Realistic story content that matches the "analog nostalgia" theme
- Proper metadata (tags, reactions, read counts, etc.)

### 💬 Comments Collection  
- Sample supportive comments on stories
- Demonstrates the comment structure and reactions

### ❤️ User Reactions Collection
- Random user reactions on stories
- Anonymous user fingerprints for reaction tracking

### 📊 Site Stats Collection
- Current site statistics
- Popular tags and mood distributions
- Activity metrics

## How to run:

```bash
# Make sure you have your .env file set up with Firebase credentials
npm run populate-db
```

## Sample Data Included:

- **"The Letter I Never Sent"** - A nostalgic story about undelivered love letters
- **"When Everything Fell Apart"** - A heartbreaking breakup story  
- **"The Day I Laughed Again"** - A hopeful healing journey
- **"The One That Got Away"** - A regretful missed connection
- **"Thank You, Next"** - A grateful closure story

Each story includes:
- Authentic emotional content
- Appropriate mood classifications
- Realistic reaction counts
- URL-friendly slugs
- Timestamp metadata

## After running:

1. Check your Firebase Console to see the collections
2. Your app will now have data to work with
3. You can start building the UI components with real data

## Note:

This script is safe to run multiple times - it will create new documents each time. If you want to clear the database first, do it manually in the Firebase Console.
