import { Link } from 'react-router-dom'
import '../styles/Home.css'

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Almost Archive</h1>
            <p className="hero-subtitle">
              Where memories find their voice and thoughts settle like dust on old photographs
            </p>
            <div className="hero-cta">
              <Link to="/archive" className="btn-primary">
                Browse Stories
              </Link>
              <Link to="/about" className="btn-secondary">
                About This Space
              </Link>
            </div>
          </div>
          <div className="hero-ascii">
            <pre>{`
    ┌─────────────────┐
    │ Almost Archive  │
    │                 │
    │  ♡ ♡ ♡ ♡ ♡ ♡   │
    │                 │
    │  "In faded ink  │
    │   and whispered  │
    │   memories..."   │
    │                 │
    │     ~ xoxo      │
    └─────────────────┘
            `}</pre>
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <h2>Recent Entries</h2>
          <div className="post-grid">
            <article className="post-card">
              <h3>The First Page...</h3>
              <p>Like finding an empty diary with cream pages waiting for the first words. 
              This space holds infinite possibilities - each post a letter to the future, 
              each thought a polaroid of this moment.</p>
              <span className="date">� Waiting to be written</span>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
