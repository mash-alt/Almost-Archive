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

      <section className="about-cta">
        <div className="container">
          <div className="about-card">
            <div className="about-content">
              <h2>🌙 How It All Began</h2>
              <p>
                Born from a 3AM conversation between two friends across oceans, Almost Archive is more than just a collection of stories. 
                It's a testament to the connections that transcend distance and the beauty found in shared vulnerability.
              </p>
              <p className="about-preview">
                "What if we created a space where people could share their almosts without judgment?"
              </p>
              <Link to="/about" className="about-link">
                Read our story →
              </Link>
            </div>
            <div className="about-visual">
              <div className="friendship-ascii">
                <pre>{`
  🌏 ────────── 🌍
    Chloui    Zach
      │        │
      └── 💝 ──┘
    Almost Archive
                `}</pre>
              </div>
            </div>
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
