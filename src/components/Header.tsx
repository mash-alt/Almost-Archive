import { Link } from 'react-router-dom'
import '../styles/Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <h1>Almost Archive</h1>
          </Link>
        </div>
        <nav className="navigation">
          <ul>
            <li><Link to="/">home</Link></li>
            <li><Link to="/archive">archive</Link></li>
            <li><Link to="/submit">write</Link></li>
            <li><Link to="/about">about</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
