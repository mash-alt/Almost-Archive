import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header.tsx'
import Footer from './components/Footer.tsx'
import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import Archive from './pages/Archive.tsx'
import StoryDetail from './pages/StoryDetail.tsx'
import SubmitStory from './components/SubmitStory.tsx'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/story/:id" element={<StoryDetail />} />
          <Route path="/submit" element={<SubmitStory />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
