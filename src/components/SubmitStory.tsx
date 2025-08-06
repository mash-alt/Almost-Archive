import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  MOOD_OPTIONS, 
  CONSTANTS, 
  type StorySubmission, 
  type ValidationError 
} from '../types';
import './SubmitStory.css';

const SubmitStory: React.FC = () => {
  const [formData, setFormData] = useState<StorySubmission>({
    title: '',
    body: '',
    authorName: '',
    dateOfMemory: '',
    tags: [],
    mood: MOOD_OPTIONS[0]
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false);

  // Helper function to create slug
  const createSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!formData.title.trim()) {
      newErrors.push({ field: 'title', message: 'Title is required' });
    } else if (formData.title.length > CONSTANTS.MAX_TITLE_LENGTH) {
      newErrors.push({ field: 'title', message: `Title must be less than ${CONSTANTS.MAX_TITLE_LENGTH} characters` });
    }

    if (!formData.body.trim()) {
      newErrors.push({ field: 'body', message: 'Story content is required' });
    } else if (formData.body.length > CONSTANTS.MAX_BODY_LENGTH) {
      newErrors.push({ field: 'body', message: `Story must be less than ${CONSTANTS.MAX_BODY_LENGTH} characters` });
    }

    if (formData.tags.length === 0) {
      newErrors.push({ field: 'tags', message: 'At least one tag is required' });
    } else if (formData.tags.length > CONSTANTS.MAX_TAGS_PER_STORY) {
      newErrors.push({ field: 'tags', message: `Maximum ${CONSTANTS.MAX_TAGS_PER_STORY} tags allowed` });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Initialize Firebase (same as population script)
      const { initializeApp } = await import('firebase/app');
      const { getFirestore, doc, setDoc, collection } = await import('firebase/firestore');
      
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
      
      // Create the story document (same structure as population script)
      const storyRef = doc(collection(db, 'stories'));
      const storyData = {
        id: storyRef.id,
        title: formData.title.trim(),
        body: formData.body.trim(),
        authorName: formData.authorName?.trim() || undefined,
        dateOfMemory: formData.dateOfMemory || undefined,
        dateSubmitted: new Date().toISOString(),
        tags: formData.tags,
        mood: {
          type: formData.mood.type,
          emoji: formData.mood.emoji,
          label: formData.mood.label,
          color: formData.mood.color
        },
        reactions: { heartbroken: 0, lol: 0, hug: 0, exSucks: 0, total: 0 },
        readCount: 0,
        isPublished: true,
        slug: createSlug(formData.title),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(storyRef, storyData);
      
      console.log('✅ Story submitted successfully:', storyData.title);
      setSubmitted(true);
      
    } catch (error) {
      console.error('❌ Error submitting story:', error);
      setErrors([{ field: 'submit', message: 'Failed to submit story. Please try again.' }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle adding tags
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < CONSTANTS.MAX_TAGS_PER_STORY) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  // Handle removing tags
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Get error for specific field
  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  if (submitted) {
    return (
      <div className="submit-story-page">
        <div className="submit-story-container">
          <div className="submission-success">
            <h1>📝 Story Submitted!</h1>
            <p>Thank you for sharing your story. It's now part of the Almost Archive.</p>
            <button 
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  title: '',
                  body: '',
                  authorName: '',
                  dateOfMemory: '',
                  tags: [],
                  mood: MOOD_OPTIONS[0]
                });
              }}
              className="submit-another-btn"
            >
              Submit Another Story
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-story-page">
      <div className="submit-story-container">
        <header className="submit-story-header">
          <h1>📝 Share Your Story</h1>
          <p>Every story matters. Your words might be exactly what someone else needs to hear.</p>
        </header>

        <form onSubmit={handleSubmit} className="submit-story-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Story Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Give your story a title..."
              className={getFieldError('title') ? 'error' : ''}
              maxLength={CONSTANTS.MAX_TITLE_LENGTH}
            />
            {getFieldError('title') && <span className="error-message">{getFieldError('title')}</span>}
            <span className="char-count">{formData.title.length}/{CONSTANTS.MAX_TITLE_LENGTH}</span>
          </div>

          {/* Author Name */}
          <div className="form-group">
            <label htmlFor="authorName">Your Name (Optional)</label>
            <input
              type="text"
              id="authorName"
              value={formData.authorName}
              onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
              placeholder="Anonymous, nickname, or real name..."
            />
            <small>You can remain anonymous or use any name you'd like.</small>
          </div>

          {/* Date of Memory */}
          <div className="form-group">
            <label htmlFor="dateOfMemory">When did this happen? (Optional)</label>
            <input
              type="date"
              id="dateOfMemory"
              value={formData.dateOfMemory}
              onChange={(e) => setFormData(prev => ({ ...prev, dateOfMemory: e.target.value }))}
            />
          </div>

          {/* Story Content */}
          <div className="form-group">
            <div className="story-content-header">
              <label htmlFor="body">Your Story *</label>
              <div className="content-controls">
                <button
                  type="button"
                  onClick={() => setShowMarkdownHelp(!showMarkdownHelp)}
                  className="help-btn"
                >
                  📝 Formatting Help
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="preview-btn"
                >
                  {showPreview ? '✏️ Edit' : '👁️ Preview'}
                </button>
              </div>
            </div>

            {showMarkdownHelp && (
              <div className="markdown-help">
                <h4>📝 Formatting Guide:</h4>
                <div className="help-examples">
                  <div className="help-item">
                    <code>**bold text**</code> → <strong>bold text</strong>
                  </div>
                  <div className="help-item">
                    <code>*italic text*</code> → <em>italic text</em>
                  </div>
                  <div className="help-item">
                    <code>`code text`</code> → <code>code text</code>
                  </div>
                  <div className="help-item">
                    <code># Heading</code> → <strong>Large heading</strong>
                  </div>
                  <div className="help-item">
                    <code>## Smaller heading</code> → <strong>Smaller heading</strong>
                  </div>
                  <div className="help-item">
                    <code>- List item</code> → • List item
                  </div>
                  <div className="help-item">
                    <code>&gt; Quote</code> → <em>Quote block</em>
                  </div>
                </div>
              </div>
            )}

            <div className="story-content-container">
              {!showPreview ? (
                <textarea
                  id="body"
                  value={formData.body}
                  onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Tell your story... You can use formatting like **bold**, *italic*, `code`, # headings, and more!"
                  className={getFieldError('body') ? 'error' : ''}
                  rows={12}
                  maxLength={CONSTANTS.MAX_BODY_LENGTH}
                />
              ) : (
                <div className="story-preview">
                  {formData.body ? (
                    <div className="markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {formData.body}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="preview-placeholder">Start typing your story to see the preview...</p>
                  )}
                </div>
              )}
            </div>

            {getFieldError('body') && <span className="error-message">{getFieldError('body')}</span>}
            <span className="char-count">{formData.body.length}/{CONSTANTS.MAX_BODY_LENGTH}</span>
          </div>

          {/* Mood Selection */}
          <div className="form-group">
            <label>How are you feeling about this story? *</label>
            <div className="mood-selector">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, mood }))}
                  className={`mood-option ${formData.mood.type === mood.type ? 'selected' : ''}`}
                  style={{ '--mood-color': mood.color } as React.CSSProperties}
                >
                  <span className="mood-emoji">{mood.emoji}</span>
                  <span className="mood-label">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label htmlFor="tags">Tags * (help others find your story)</label>
            <div className="tag-input-container">
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tags like 'heartbreak', 'healing', 'first love'..."
                className={getFieldError('tags') ? 'error' : ''}
              />
              <button type="button" onClick={addTag} className="add-tag-btn">
                Add
              </button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="tags-display">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="remove-tag">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {getFieldError('tags') && <span className="error-message">{getFieldError('tags')}</span>}
            <small>{formData.tags.length}/{CONSTANTS.MAX_TAGS_PER_STORY} tags</small>
          </div>

          {/* Submit Button */}
          <div className="form-group">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? '📝 Submitting...' : '📝 Share My Story'}
            </button>
            {getFieldError('submit') && <span className="error-message">{getFieldError('submit')}</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitStory;
