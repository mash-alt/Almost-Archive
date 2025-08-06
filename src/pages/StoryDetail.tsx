import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where, orderBy, addDoc, updateDoc, increment } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '../firebaseConfig';
import { 
  type Story, 
  type Comment, 
  type UserReaction, 
  MOOD_OPTIONS, 
  REACTION_OPTIONS 
} from '../types';
import './StoryDetail.css';

// LocalStorage keys for tracking user interactions
const USER_REACTIONS_KEY = 'almostArchive_userReactions';
const USER_VIEWS_KEY = 'almostArchive_userViews';

// Helper functions for localStorage
const getUserReactions = (): { [storyId: string]: string } => {
  try {
    const stored = localStorage.getItem(USER_REACTIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveUserReaction = (storyId: string, reactionType: string) => {
  try {
    const reactions = getUserReactions();
    reactions[storyId] = reactionType;
    localStorage.setItem(USER_REACTIONS_KEY, JSON.stringify(reactions));
  } catch (error) {
    console.error('Failed to save reaction to localStorage:', error);
  }
};

const getUserViews = (): string[] => {
  try {
    const stored = localStorage.getItem(USER_VIEWS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const markStoryAsViewed = (storyId: string) => {
  try {
    const views = getUserViews();
    if (!views.includes(storyId)) {
      views.push(storyId);
      localStorage.setItem(USER_VIEWS_KEY, JSON.stringify(views));
      return true; // First view
    }
    return false; // Already viewed
  } catch (error) {
    console.error('Failed to save view to localStorage:', error);
    return false;
  }
};

const StoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Comment form state
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState({
    author: '',
    content: '',
    email: ''
  });
  const [submittingComment, setSubmittingComment] = useState(false);

  // Reaction state
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (!id) {
      setError('No story ID provided');
      setLoading(false);
      return;
    }

    // Check if user already reacted to this story
    const existingReactions = getUserReactions();
    if (existingReactions[id]) {
      setUserReaction(existingReactions[id]);
    }

    loadStoryData();
  }, [id]);

  const loadStoryData = async () => {
    try {
      setLoading(true);
      
      // Load story
      const storyDoc = await getDoc(doc(db, 'stories', id!));
      if (!storyDoc.exists()) {
        setError('Story not found');
        setLoading(false);
        return;
      }

      const storyData = { id: storyDoc.id, ...storyDoc.data() } as Story;
      setStory(storyData);

      // Increment view count only if user hasn't viewed this story before
      const isFirstView = markStoryAsViewed(id!);
      if (isFirstView) {
        await updateDoc(doc(db, 'stories', id!), {
          readCount: increment(1)
        });
        console.log('📈 View count incremented for first-time view');
      }

      // Load comments
      const commentsQuery = query(
        collection(db, 'comments'),
        where('storyId', '==', id),
        orderBy('createdAt', 'desc')
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      const commentsData = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(commentsData);

      // Load reactions
      const reactionsQuery = query(
        collection(db, 'reactions'),
        where('storyId', '==', id)
      );
      const reactionsSnapshot = await getDocs(reactionsQuery);
      const reactionsData = reactionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as unknown as UserReaction[];
      
      // Calculate reaction counts
      const counts: { [key: string]: number } = {};
      reactionsData.forEach(reaction => {
        counts[reaction.reactionType] = (counts[reaction.reactionType] || 0) + 1;
      });
      setReactionCounts(counts);

    } catch (err) {
      console.error('Error loading story data:', err);
      setError('Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author.trim() || !newComment.content.trim()) return;
    
    setSubmittingComment(true);
    try {
      const commentData = {
        storyId: id!,
        authorName: newComment.author.trim(),
        body: newComment.content.trim(),
        timestamp: new Date().toISOString(),
        isSupport: true,
        reactions: { hearts: 0, hugs: 0 }
      };

      await addDoc(collection(db, 'comments'), commentData);
      
      // Reset form
      setNewComment({ author: '', content: '', email: '' });
      setShowCommentForm(false);
      
      // Reload comments
      loadStoryData();
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReaction = async (reactionType: string) => {
    // Prevent multiple reactions from the same user
    if (userReaction) {
      alert('You\'ve already reacted to this story! Thank you for sharing your feelings.');
      return;
    }

    try {
      // Add reaction to Firestore
      const reactionData = {
        storyId: id!,
        reactionType: reactionType,
        timestamp: new Date().toISOString(),
        userFingerprint: `anonymous-${Date.now()}` // Simple anonymous ID
      };

      await addDoc(collection(db, 'reactions'), reactionData);
      
      // Save user's reaction to localStorage to prevent duplicate reactions
      saveUserReaction(id!, reactionType);
      
      // Update local state
      setUserReaction(reactionType);
      setReactionCounts(prev => ({
        ...prev,
        [reactionType]: (prev[reactionType] || 0) + 1
      }));

      console.log(`✨ Added ${reactionType} reaction`);
    } catch (err) {
      console.error('Error adding reaction:', err);
      alert('Failed to add reaction. Please try again.');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    
    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodStyle = (mood: any) => {
    const moodOption = MOOD_OPTIONS.find(m => m.type === mood.type || m.type === mood);
    return moodOption ? { '--mood-color': moodOption.color } as React.CSSProperties : {};
  };

  if (loading) {
    return (
      <div className="story-detail">
        <div className="story-container">
          <div className="loading-state">
            <h2>Loading story...</h2>
            <p>Please wait while we fetch the story for you.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="story-detail">
        <div className="story-container">
          <div className="error-state">
            <h2>Story not found</h2>
            <p>{error || 'The story you are looking for does not exist.'}</p>
            <Link to="/archive" className="back-to-archive">
              ← Back to Archive
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="story-detail">
      <div className="story-container">
        {/* Story Header */}
        <header className="story-header">
          <Link to="/archive" className="back-link">
            ← Back to Archive
          </Link>
          
          <h1 className="story-title">{story.title}</h1>
          
          <div className="story-meta">
            <div className="meta-left">
              <span className="author">by {story.authorName || 'Anonymous'}</span>
              <span className="date">{formatDate(story.dateSubmitted)}</span>
            </div>
            
            <div className="story-mood" style={getMoodStyle(story.mood)}>
              <span className="mood-emoji">
                {MOOD_OPTIONS.find(m => m.type === (story.mood.type || story.mood))?.emoji}
              </span>
              <span className="mood-label">
                {MOOD_OPTIONS.find(m => m.type === (story.mood.type || story.mood))?.label}
              </span>
            </div>
          </div>

          <div className="story-stats">
            <span>{story.readCount || 0} views</span>
            <span>{comments.length} comments</span>
            <span>{Object.values(reactionCounts).reduce((a, b) => a + b, 0)} reactions</span>
          </div>
        </header>

        {/* Story Content */}
        <article className="story-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {story.body}
          </ReactMarkdown>
        </article>

        {/* Story Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="story-tags-section">
            <h3>Tags</h3>
            <div className="story-tags">
              {story.tags.map((tag, index) => (
                <span key={index} className="story-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reactions Section */}
        <div className="reactions-section">
          <h3>How did this story make you feel?</h3>
          {userReaction && (
            <p className="reaction-feedback">
              ✨ Thank you for sharing your feelings! You reacted with {REACTION_OPTIONS.find(r => r.type === userReaction)?.label}.
            </p>
          )}
          <div className="reactions-grid">
            {REACTION_OPTIONS.map(reaction => (
              <button
                key={reaction.type}
                className={`reaction-btn ${userReaction === reaction.type ? 'selected' : ''}`}
                onClick={() => handleReaction(reaction.type)}
                disabled={!!userReaction}
                title={userReaction ? 'You\'ve already reacted to this story' : `React with ${reaction.label}`}
              >
                <span className="reaction-emoji">{reaction.emoji}</span>
                <span className="reaction-label">{reaction.label}</span>
                <span className="reaction-count">{reactionCounts[reaction.type] || 0}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <div className="comments-header">
            <h3>Comments ({comments.length})</h3>
            <button 
              className="add-comment-btn"
              onClick={() => setShowCommentForm(!showCommentForm)}
            >
              {showCommentForm ? 'Cancel' : 'Add Comment'}
            </button>
          </div>

          {/* Comment Form */}
          {showCommentForm && (
            <form className="comment-form" onSubmit={handleSubmitComment}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="comment-author">Name *</label>
                  <input
                    id="comment-author"
                    type="text"
                    value={newComment.author}
                    onChange={(e) => setNewComment(prev => ({ ...prev, author: e.target.value }))}
                    required
                    placeholder="Your name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="comment-email">Email (optional)</label>
                  <input
                    id="comment-email"
                    type="email"
                    value={newComment.email}
                    onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="comment-content">Comment *</label>
                <textarea
                  id="comment-content"
                  value={newComment.content}
                  onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                  required
                  rows={4}
                  placeholder="Share your thoughts about this story..."
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowCommentForm(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submittingComment}
                  className="submit-btn"
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.authorName || 'Anonymous'}</span>
                    <span className="comment-date">{formatDate(comment.timestamp)}</span>
                  </div>
                  <div className="comment-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {comment.body}
                    </ReactMarkdown>
                  </div>
                  {comment.reactions.hearts > 0 && (
                    <div className="comment-likes">
                      ❤️ {comment.reactions.hearts}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Stories */}
        <div className="related-section">
          <h3>More stories you might enjoy</h3>
          <Link to="/archive" className="browse-more">
            Browse all stories in the archive →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
