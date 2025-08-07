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
                <span className="title">origin_story.txt</span>
              </div>
              <div className="terminal-body">
                <pre>{`
It all began with a 3AM conversation between two 
friends in different parts of the world. Chloui was 
wide awake in the quiet hours of the night, and Zach 
was sipping his afternoon coffee—two different time 
zones, one shared thought:

"What about all the relationships that almost worked out?"

From that question, Almost Archive was born.

This space is for the stories that don't usually get 
told—the ones without happy endings, the first loves 
that faded, connections that still lingers in memory, 
the people who mattered but didn't stay, and maybe 
even summer flings.

Here, we don't ask for closure.
We don't demand silver linings.
We just want honesty.

Because sometimes, "almost" is the whole story.

– Chloui & Zach
                `}</pre>
              </div>
            </div>
          </section>

          <section className="stats">
            <h2>What We're About</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">💔</div>
                <div className="stat-label">real stories, no filters</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">🌍</div>
                <div className="stat-label">friends across time zones</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">∞</div>
                <div className="stat-label">almosts that mattered</div>
              </div>
            </div>
          </section>

          <section className="purpose">
            <h2>Why This Exists</h2>
            <div className="purpose-content">
              <p>Your almost-relationship was real. That summer thing that didn't make it to fall still changed you. The person you loved from afar taught you something about yourself.</p>
              
              <p>We made this for the stories that don't end with "happily ever after" but still deserve to be told.</p>
              
              <div className="quote">
                Not every love story ends with forever.<br/>
                Some just end with "almost."<br/>
                And that's okay too.
              </div>
            </div>
          </section>

          <section className="tech">
            <h2>Built With</h2>
            <div className="tech-stack">
              <span className="tech-item">⚛️ react</span>
              <span className="tech-item">🔥 firebase</span>
              <span className="tech-item">📝 markdown</span>
              <span className="tech-item">🎨 css</span>
              <span className="tech-item">🌙 late night chats</span>
              <span className="tech-item">💔 shared understanding</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default About
