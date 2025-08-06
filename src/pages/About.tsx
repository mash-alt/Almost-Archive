import '../styles/About.css'

const About = () => {
  return (
    <div className="about">
      <div className="container">
        <header className="about-header">
          <h1>About This Space</h1>
          <div className="retro-divider">
            ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~
          </div>
        </header>

        <div className="about-content">
          <section className="intro">
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
                <span className="title">dear_reader.txt</span>
              </div>
              <div className="terminal-body">
                <pre>{`
hello there, dear soul,

you've stumbled into my little corner of the
internet - a place where thoughts settle like 
dust on old photographs, where words find their
way onto cream-colored pages, and where every
entry feels like a letter to a future self.

this is "Almost Archive" - not just another blog,
but a digital shoebox of memories, musings, and
moments that felt too precious to let slip away
into the void.

here you'll find:
  ♡ handwritten thoughts typed with care
  ♡ polaroids of moments caught in words  
  ♡ letters that never found their recipient
  ♡ poetry that bloomed at 2am
  ♡ stories told in sepia tones

come, stay a while. pull up that old armchair,
make some tea, and let's pretend we're old
friends sharing secrets by lamplight.

with love and ink-stained fingers,
the keeper of these pages ♡
                `}</pre>
              </div>
            </div>
          </section>

          <section className="stats">
            <h2>This Moment</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">∞</div>
                <div className="stat-label">dreams & possibilities</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">2025</div>
                <div className="stat-label">year of new beginnings</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">♡</div>
                <div className="stat-label">love letters waiting</div>
              </div>
            </div>
          </section>

          <section className="tech">
            <h2>Crafted With</h2>
            <div className="tech-stack">
              <span className="tech-item">⚛️ react (for the magic)</span>
              <span className="tech-item">📦 vite (for speed)</span>
              <span className="tech-item">🛣️ router (for journeys)</span>
              <span className="tech-item">🎨 css3 (for beauty)</span>
              <span className="tech-item">📝 typescript (for clarity)</span>
              <span className="tech-item">♡ love (most importantly)</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default About
