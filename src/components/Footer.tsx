import '../styles/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; 2025 Almost Archive. Written with love and nostalgia.</p>
          <div className="social-links">
            <span>stay in touch:</span>
            <a href="https://www.instagram.com/mashirooo_32/" target="_blank" rel="noopener noreferrer" aria-label="Follow on Instagram">📷</a>
            <a href="https://github.com/mash-alt" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">💻</a>
            <a href="mailto:moseszachfsabido@gmail.com" aria-label="Send Email">✉️</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
