import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  type Story,
  type StoryPreview,
  type SortOption,
  MOOD_OPTIONS,
  CONSTANTS
} from '../types';
import './Archive.css';

// LocalStorage keys for tracking user interactions
const USER_LIKES_KEY = 'almostArchive_userLikes';

// Helper functions for localStorage
const getUserLikes = (): { [key: string]: boolean } => {
  try {
    const stored = localStorage.getItem(USER_LIKES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveUserLike = (storyId: string) => {
  try {
    const likes = getUserLikes();
    likes[storyId] = true;
    localStorage.setItem(USER_LIKES_KEY, JSON.stringify(likes));
  } catch (error) {
    console.error('Failed to save user like:', error);
  }
};

const Archive: React.FC = () => {
  const [stories, setStories] = useState<StoryPreview[]>([]);
  const [filteredStories, setFilteredStories] = useState<StoryPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = CONSTANTS.STORIES_PER_PAGE;

  // User likes state
  const [userLikes, setUserLikes] = useState<{ [key: string]: boolean }>({});

  // Load stories from Firestore
  useEffect(() => {
    loadStories();
    // Load user likes from localStorage
    setUserLikes(getUserLikes());
  }, []);

  // Apply filters and sorting when data or filters change
  useEffect(() => {
    applyFiltersAndSort();
  }, [stories, searchQuery, selectedMoods, selectedTags, sortBy]);

  const loadStories = async () => {
    try {
      setLoading(true);
      
      // Initialize Firebase
      const { initializeApp } = await import('firebase/app');
      const { getFirestore, collection, getDocs } = await import('firebase/firestore');
      
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
      };
      
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      
      // Get all stories (simple query without indexes)
      const querySnapshot = await getDocs(collection(db, 'stories'));
      const loadedStories: StoryPreview[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Story;
        
        // Filter out unpublished stories client-side
        if (!data.isPublished) return;
        
        // Handle mood data - it might be stored as string or object
        let moodObject;
        if (typeof data.mood === 'string') {
          moodObject = MOOD_OPTIONS.find(m => m.type === (data.mood as unknown as string)) || MOOD_OPTIONS[0];
        } else if (data.mood && typeof data.mood === 'object') {
          moodObject = data.mood;
        } else {
          moodObject = MOOD_OPTIONS[0]; // Default fallback
        }

        const preview: StoryPreview = {
          id: doc.id, // Use document ID, not data.id
          title: data.title,
          preview: data.body.substring(0, CONSTANTS.STORY_PREVIEW_LENGTH) + 
                  (data.body.length > CONSTANTS.STORY_PREVIEW_LENGTH ? '...' : ''),
          authorName: data.authorName,
          dateSubmitted: data.dateSubmitted,
          tags: data.tags || [],
          mood: moodObject,
          reactions: data.reactions || { heartbroken: 0, lol: 0, hug: 0, 'ex-sucks': 0, total: 0 },
          readCount: data.readCount || 0,
          slug: data.slug
        };
        loadedStories.push(preview);
      });
      
      setStories(loadedStories);
      console.log(`✅ Loaded ${loadedStories.length} stories`);
      
    } catch (err) {
      console.error('❌ Error loading stories:', err);
      setError('Failed to load stories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...stories];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(query) ||
        story.preview.toLowerCase().includes(query) ||
        story.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (story.authorName && story.authorName.toLowerCase().includes(query))
      );
    }

    // Apply mood filter
    if (selectedMoods.length > 0) {
      filtered = filtered.filter(story =>
        selectedMoods.includes(story.mood.type)
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(story =>
        selectedTags.some(tag => story.tags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime();
        case 'oldest':
          return new Date(a.dateSubmitted).getTime() - new Date(b.dateSubmitted).getTime();
        case 'most-read':
          return b.readCount - a.readCount;
        case 'most-reacted':
          return b.reactions.total - a.reactions.total;
        default:
          return 0;
      }
    });

    setFilteredStories(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Get all unique tags from stories
  const getAllTags = () => {
    const allTags = stories.flatMap(story => story.tags);
    return [...new Set(allTags)].sort();
  };

  // Handle tag toggle
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Handle mood toggle
  const toggleMood = (mood: string) => {
    setSelectedMoods(prev =>
      prev.includes(mood)
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMoods([]);
    setSelectedTags([]);
    setSortBy('newest');
  };

  // Handle story like
  const handleStoryLike = async (e: React.MouseEvent, storyId: string) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    // Check if user already liked this story
    if (userLikes[storyId]) {
      alert('You\'ve already liked this story! ❤️');
      return;
    }

    try {
      // Initialize Firebase
      const { initializeApp } = await import('firebase/app');
      const { getFirestore, doc, updateDoc, increment } = await import('firebase/firestore');
      
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
      };
      
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      // Update reaction count in Firestore
      await updateDoc(doc(db, 'stories', storyId), {
        'reactions.total': increment(1)
      });

      // Save user's like to localStorage
      saveUserLike(storyId);
      setUserLikes(prev => ({ ...prev, [storyId]: true }));

      // Update local state
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, reactions: { ...story.reactions, total: story.reactions.total + 1 } }
          : story
      ));

      console.log(`✨ Liked story: ${storyId}`);
    } catch (error) {
      console.error('Error liking story:', error);
      alert('Failed to like story. Please try again.');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);
  const startIndex = (currentPage - 1) * storiesPerPage;
  const currentStories = filteredStories.slice(startIndex, startIndex + storiesPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="archive-page">
        <div className="archive-container">
          <div className="loading-state">
            <h2>📚 Loading stories...</h2>
            <p>Gathering memories from the archive...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="archive-page">
        <div className="archive-container">
          <div className="error-state">
            <h2>❌ Something went wrong</h2>
            <p>{error}</p>
            <button onClick={loadStories} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="archive-page">
      <div className="archive-container">
        {/* Header */}
        <header className="archive-header">
          <h1>📚 The Archive</h1>
          <p>Stories of love, loss, and everything in between</p>
          <div className="archive-stats">
            <span>{stories.length} stories</span>
            <span>{filteredStories.length} showing</span>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="archive-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search stories, tags, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="controls-row">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filter-toggle-btn"
            >
              🔽 Filters {(selectedMoods.length + selectedTags.length) > 0 && `(${selectedMoods.length + selectedTags.length})`}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-read">Most Read</option>
              <option value="most-reacted">Most Reactions</option>
            </select>

            {(searchQuery || selectedMoods.length > 0 || selectedTags.length > 0) && (
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear All
              </button>
            )}
          </div>

          {showFilters && (
            <div className="filters-panel">
              {/* Mood Filters */}
              <div className="filter-group">
                <h4>💭 Filter by Mood</h4>
                <div className="mood-filters">
                  {MOOD_OPTIONS.map(mood => (
                    <button
                      key={mood.type}
                      onClick={() => toggleMood(mood.type)}
                      className={`mood-filter ${selectedMoods.includes(mood.type) ? 'selected' : ''}`}
                      style={{ '--mood-color': mood.color } as React.CSSProperties}
                    >
                      <span className="mood-emoji">{mood.emoji}</span>
                      <span className="mood-label">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag Filters */}
              <div className="filter-group">
                <h4>🏷️ Filter by Tags</h4>
                <div className="tag-filters">
                  {getAllTags().slice(0, 20).map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`tag-filter ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stories Grid */}
        {currentStories.length === 0 ? (
          <div className="no-stories">
            <h3>📝 No stories found</h3>
            <p>Try adjusting your filters or search terms.</p>
            <Link to="/submit" className="submit-story-link">
              Share the first story?
            </Link>
          </div>
        ) : (
          <>
            <div className="stories-grid">
              {currentStories.map((story) => (
                <Link key={story.id} to={`/story/${story.id}`} className="story-card-link">
                  <article className="story-card">
                    <div className="story-card-header">
                      <h3 className="story-title">
                        {story.title}
                      </h3>
                      <div className="story-meta">
                        <span className="story-author">
                          by {story.authorName || 'Anonymous'}
                        </span>
                        <span className="story-date">
                          {formatDate(story.dateSubmitted)}
                        </span>
                      </div>
                    </div>

                    <div className="story-content">
                      <div className="story-preview">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {story.preview}
                        </ReactMarkdown>
                      </div>
                    </div>

                    <div className="story-card-footer">
                      <div className="story-mood" style={{ '--mood-color': story.mood.color } as React.CSSProperties}>
                        <span className="mood-emoji">{story.mood.emoji}</span>
                        <span className="mood-label">{story.mood.label}</span>
                      </div>

                      <div className="story-stats">
                        <span className="read-count">👁️ {story.readCount}</span>
                        <button
                          className={`like-btn ${userLikes[story.id] ? 'liked' : ''}`}
                          onClick={(e) => handleStoryLike(e, story.id)}
                          disabled={userLikes[story.id]}
                          title={userLikes[story.id] ? 'You\'ve already liked this story' : 'Like this story'}
                        >
                          ❤️ {story.reactions.total}
                        </button>
                      </div>
                    </div>

                    <div className="story-tags">
                      {story.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index} 
                          className="story-tag" 
                          onClick={(e) => {
                            e.preventDefault(); // Prevent navigation when clicking tags
                            e.stopPropagation();
                            toggleTag(tag);
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {story.tags.length > 3 && <span className="more-tags">+{story.tags.length - 3}</span>}
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  ← Previous
                </button>

                <div className="page-numbers">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && <span className="page-ellipsis">...</span>}
                  {totalPages > 5 && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`page-number ${currentPage === totalPages ? 'active' : ''}`}
                    >
                      {totalPages}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Archive;
