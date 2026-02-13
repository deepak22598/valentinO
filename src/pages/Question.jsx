import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import confetti from 'canvas-confetti'
import './Question.css'

function Question() {
  const { name } = useParams()
  // Decode base64 encoded name
  let decodedName = ''
  try {
    const base64Decoded = atob(name.replace(/[-_]/g, (match) => ({ '-': '+', '_': '/' }[match])))
    decodedName = decodeURIComponent(base64Decoded)
  } catch (e) {
    // Fallback to direct decode if not base64
    try {
      decodedName = decodeURIComponent(name || '')
    } catch (err) {
      decodedName = name || ''
    }
  }
  const [showModal, setShowModal] = useState(false)
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 })
  const noButtonRef = useRef(null)
  const buttonsContainerRef = useRef(null)
  const lastMoveTime = useRef(0)

  useEffect(() => {
    // Initialize No button position
    if (noButtonRef.current && buttonsContainerRef.current) {
      const container = buttonsContainerRef.current
      const button = noButtonRef.current
      
      // Wait for button to render to get its dimensions
      setTimeout(() => {
        const containerWidth = container.offsetWidth
        const containerHeight = container.offsetHeight
        const buttonWidth = button.offsetWidth || 100
        const buttonHeight = button.offsetHeight || 50
        
        setNoButtonPosition({
          x: containerWidth / 2 - buttonWidth / 2,
          y: containerHeight / 2 + 40
        })
      }, 100)
    }
  }, [])

  const handleYes = () => {
    setShowModal(true)
    
    // Confetti animation
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }

  const moveNoButton = () => {
    if (noButtonRef.current && buttonsContainerRef.current) {
      const container = buttonsContainerRef.current
      const button = noButtonRef.current
      
      const containerWidth = container.offsetWidth || 600
      const containerHeight = container.offsetHeight || 200
      const buttonWidth = button.offsetWidth || 100
      const buttonHeight = button.offsetHeight || 50
      
      // Calculate available space, leaving some padding
      const padding = 20
      const maxX = Math.max(padding, containerWidth - buttonWidth - padding)
      const maxY = Math.max(padding, containerHeight - buttonHeight - padding)
      
      // Generate random position within bounds, ensuring it moves to very different coordinates
      let newX, newY, attempts = 0
      do {
        // Use more varied random distribution
        const randomFactor = Math.random()
        if (randomFactor < 0.33) {
          // Top area
          newX = Math.random() * (maxX - padding) + padding
          newY = Math.random() * (maxY * 0.4) + padding
        } else if (randomFactor < 0.66) {
          // Bottom area
          newX = Math.random() * (maxX - padding) + padding
          newY = Math.random() * (maxY * 0.4) + (maxY * 0.6)
        } else {
          // Left or right area
          const side = Math.random() < 0.5
          if (side) {
            newX = Math.random() * (maxX * 0.4) + padding
            newY = Math.random() * (maxY - padding) + padding
          } else {
            newX = Math.random() * (maxX * 0.4) + (maxX * 0.6)
            newY = Math.random() * (maxY - padding) + padding
          }
        }
        attempts++
        // Ensure minimum distance of 80px from current position, or try different area
      } while (
        attempts < 10 && 
        Math.abs(newX - noButtonPosition.x) < 80 && 
        Math.abs(newY - noButtonPosition.y) < 80
      )
      
      setNoButtonPosition({ x: newX, y: newY })
    }
  }

  const handleNoHover = (e) => {
    e.preventDefault()
    // Throttle movements to prevent excessive re-renders
    const now = Date.now()
    if (now - lastMoveTime.current > 100) {
      lastMoveTime.current = now
      moveNoButton()
    }
  }

  const handleNoClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Move button even if somehow clicked
    moveNoButton()
    return false
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <div className="question-container">
      <div className="question-card">
        <h1 className="question-title">
          Will you be my valentine, <span className="name-highlight">{decodedName}</span>?
        </h1>
        
        <div className="buttons-container" ref={buttonsContainerRef}>
          <button 
            onClick={handleYes} 
            className="yes-button"
          >
            Yes! 💕
          </button>
          
          <button
            ref={noButtonRef}
            onMouseEnter={handleNoHover}
            onMouseMove={handleNoHover}
            onClick={handleNoClick}
            className="no-button"
            style={{
              position: 'absolute',
              left: `${noButtonPosition.x}px`,
              top: `${noButtonPosition.y}px`,
              transition: 'left 0.15s ease-out, top 0.15s ease-out'
            }}
          >
            No
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Yay! 🎉</h2>
            <p className="modal-text">
              You made my day, {decodedName}! 💖
            </p>
            <p className="modal-subtext">
              Happy Valentine's Day! 💕
            </p>
            <button onClick={closeModal} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}

      <div className="floating-hearts">
        <span className="floating-heart">💖</span>
        <span className="floating-heart">💕</span>
        <span className="floating-heart">💗</span>
        <span className="floating-heart">💝</span>
        <span className="floating-heart">💞</span>
      </div>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} DeepAf Developers. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Question

