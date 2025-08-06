import '../styles/Blog.css'

const Blog = () => {
  return (
    <div className="blog">
      <div className="container">
        <header className="blog-header">
          <h1>Letters & Musings</h1>
          <p>thoughts pressed between pages, waiting to be discovered</p>
        </header>

        <div className="blog-content">
          <div className="posts-list">
            <article className="post-preview">
              <div className="post-meta">
                <span className="date">📅 someday soon</span>
                <span className="category">first thoughts</span>
              </div>
              <h2>The Art of Beginning</h2>
              <p className="excerpt">
                There's something magical about a blank page - like opening a shoebox 
                of forgotten letters, each one holding a piece of the past. This space 
                will collect those moments, those fleeting thoughts that deserve more 
                than just a whisper in the wind.
              </p>
              <div className="post-footer">
                <span className="read-time">⏱️ a quiet moment</span>
                <button className="read-more">read this letter →</button>
              </div>
            </article>

            <div className="empty-state">
              <div className="terminal-box">
                <div className="terminal-header">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="terminal-content">
                  <p>dear diary,</p>
                  <p>today I built something beautiful...</p>
                  <p>waiting for the first words to find their home</p>
                  <p className="cursor">♡</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="sidebar">
            <div className="widget">
              <h3>themes</h3>
              <ul>
                <li><a href="#">memories <span>(waiting)</span></a></li>
                <li><a href="#">love letters <span>(unwritten)</span></a></li>
                <li><a href="#">midnight thoughts <span>(dreaming)</span></a></li>
                <li><a href="#">poetry <span>(brewing)</span></a></li>
              </ul>
            </div>

            <div className="widget">
              <h3>archive</h3>
              <ul>
                <li><a href="#">august 2025 <span>(current)</span></a></li>
                <li><a href="#">the past <span>(preserved)</span></a></li>
              </ul>
            </div>

            <div className="widget">
              <h3>inspiration</h3>
              <ul>
                <li><a href="#">rainy afternoons <span>∞</span></a></li>
                <li><a href="#">old photographs <span>♡</span></a></li>
                <li><a href="#">handwritten notes <span>✎</span></a></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Blog
