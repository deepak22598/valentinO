import { useState } from 'react'
import './Home.css'

function Home() {
  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)

  const generateLink = () => {
    if (name.trim()) {
      // Double encode: first URI encode, then base64, then URL-safe
      const uriEncoded = encodeURIComponent(name.trim())
      const base64Encoded = btoa(uriEncoded)
      // Make URL-safe and remove padding
      const urlSafeEncoded = base64Encoded
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
      const shareableLink = `${window.location.origin}/${urlSafeEncoded}`
      setLink(shareableLink)
    }
  }

  const copyToClipboard = async () => {
    if (link) {
      try {
        await navigator.clipboard.writeText(link)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">💕 Valentine Portal 💕</h1>
        <p className="home-subtitle">Create a special Valentine's Day message</p>
        
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generateLink()}
            className="name-input"
          />
          <button onClick={generateLink} className="generate-btn">
            Generate Link
          </button>
        </div>

        {link && (
          <div className="link-section">
            <div className="link-container">
              <input
                type="text"
                value={link}
                readOnly
                className="link-input"
              />
              <button onClick={copyToClipboard} className="copy-btn">
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <p className="link-hint">Share this link with your special someone!</p>
          </div>
        )}

        <div className="hearts">
          <span className="heart">💖</span>
          <span className="heart">💕</span>
          <span className="heart">💗</span>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} DeepAf Developers. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Home

