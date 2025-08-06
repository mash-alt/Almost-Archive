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
              An anthology of almosts - stories of love that lingered, hearts that hesitated, and connections that slipped through our fingers like sand
            </p>
            <div className="hero-cta">
              <Link to="/archive" className="btn-primary">
                Read the Stories
              </Link>
              <Link to="/submit" className="btn-secondary">
                Share Your Almost
              </Link>
            </div>
          </div>
          <div className="hero-ascii">
            <pre>{`
    ┌─────────────────┐
    │ Almost Archive  │
    │                 │
    │  💔 📝 💭 📸 💌   │
    │                 │
    │  "We were       │
    │   almost        │
    │   everything"   │
    │                 │
    │     ~ almost    │
    └─────────────────┘
            `}</pre>
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <h2>Stories of Almost</h2>
          <div className="post-grid">
            <article className="post-card">
              <h3>What Lives Here...</h3>
              <p>Stories of the ones who got away. Tales of timing that was off by just a heartbeat. 
              Memories of love that felt infinite but lasted only seasons. This is a space for the 
              almosts - the relationships that taught us everything about love, loss, and the beautiful 
              ache of what could have been.</p>
              <span className="date">💔 Share your almost story</span>
            </article>
          </div>
          
          <div className="genre-tags">
            <span className="tag">First Loves</span>
            <span className="tag">Summer Flings</span>
            <span className="tag">Long Distance</span>
            <span className="tag">Wrong Timing</span>
            <span className="tag">Unrequited</span>
            <span className="tag">What If...</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
