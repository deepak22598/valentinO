import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import confetti from 'canvas-confetti'
import './Question.css'

function Question() {
  const { name } = useParams()
  // Decode base64 encoded name
  let decodedName = ''
  try {
    // Restore URL-safe base64 to standard base64
    const base64String = (name || '').replace(/-/g, '+').replace(/_/g, '/')
    // Add padding if needed
    const paddedBase64 = base64String + '='.repeat((4 - base64String.length % 4) % 4)
    const base64Decoded = atob(paddedBase64)
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
  const yesButtonRef = useRef(null)
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
    if (noButtonRef.current && buttonsContainerRef.current && yesButtonRef.current) {
      const container = buttonsContainerRef.current
      const noButton = noButtonRef.current
      const yesButton = yesButtonRef.current
      
      const containerWidth = container.offsetWidth || 600
      const containerHeight = container.offsetHeight || 200
      const noButtonWidth = noButton.offsetWidth || 100
      const noButtonHeight = noButton.offsetHeight || 50
      
      // Get YES button position relative to container
      const yesButtonRect = yesButton.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const yesButtonX = yesButtonRect.left - containerRect.left
      const yesButtonY = yesButtonRect.top - containerRect.top
      const yesButtonWidth = yesButton.offsetWidth || 150
      const yesButtonHeight = yesButton.offsetHeight || 60
      
      // Calculate available space, leaving some padding
      const padding = 20
      const minDistanceFromYes = 40 // Minimum gap between buttons (increased)
      const maxX = Math.max(padding, containerWidth - noButtonWidth - padding)
      const maxY = Math.max(padding, containerHeight - noButtonHeight - padding)
      
      // Generate random position that doesn't overlap with YES button
      let newX, newY, attempts = 0
      let validPosition = false
      
      while (attempts < 50 && !validPosition) {
        // Use more varied random distribution
        const randomFactor = Math.random()
        if (randomFactor < 0.25) {
          // Top area (above YES button if YES is in center)
          newX = Math.random() * (maxX - padding) + padding
          newY = Math.random() * Math.min(maxY * 0.3, yesButtonY - minDistanceFromYes - noButtonHeight) + padding
        } else if (randomFactor < 0.5) {
          // Bottom area (below YES button)
          const bottomStartY = yesButtonY + yesButtonHeight + minDistanceFromYes
          if (bottomStartY < maxY) {
            newX = Math.random() * (maxX - padding) + padding
            newY = Math.random() * (maxY - bottomStartY) + bottomStartY
          } else {
            // If no space below, try top
            newX = Math.random() * (maxX - padding) + padding
            newY = Math.random() * Math.min(maxY * 0.3, yesButtonY - minDistanceFromYes - noButtonHeight) + padding
          }
        } else if (randomFactor < 0.75) {
          // Left area (to the left of YES button)
          const leftMaxX = Math.min(maxX * 0.4, yesButtonX - minDistanceFromYes - noButtonWidth)
          if (leftMaxX > padding) {
            newX = Math.random() * (leftMaxX - padding) + padding
            newY = Math.random() * (maxY - padding) + padding
          } else {
            // If no space on left, try right
            const rightStartX = yesButtonX + yesButtonWidth + minDistanceFromYes
            if (rightStartX < maxX) {
              newX = Math.random() * (maxX - rightStartX) + rightStartX
              newY = Math.random() * (maxY - padding) + padding
            } else {
              // Fallback to top
              newX = Math.random() * (maxX - padding) + padding
              newY = Math.random() * Math.min(maxY * 0.3, yesButtonY - minDistanceFromYes - noButtonHeight) + padding
            }
          }
        } else {
          // Right area (to the right of YES button)
          const rightStartX = yesButtonX + yesButtonWidth + minDistanceFromYes
          if (rightStartX < maxX) {
            newX = Math.random() * (maxX - rightStartX) + rightStartX
            newY = Math.random() * (maxY - padding) + padding
          } else {
            // If no space on right, try left
            const leftMaxX = Math.min(maxX * 0.4, yesButtonX - minDistanceFromYes - noButtonWidth)
            if (leftMaxX > padding) {
              newX = Math.random() * (leftMaxX - padding) + padding
              newY = Math.random() * (maxY - padding) + padding
            } else {
              // Fallback to top
              newX = Math.random() * (maxX - padding) + padding
              newY = Math.random() * Math.min(maxY * 0.3, yesButtonY - minDistanceFromYes - noButtonHeight) + padding
            }
          }
        }
        
        // Ensure position is within bounds
        newX = Math.max(padding, Math.min(newX, maxX))
        newY = Math.max(padding, Math.min(newY, maxY))
        
        // Check if new position overlaps with YES button (with safety margin)
        const noButtonRight = newX + noButtonWidth
        const noButtonBottom = newY + noButtonHeight
        const yesButtonRight = yesButtonX + yesButtonWidth
        const yesButtonBottom = yesButtonY + yesButtonHeight
        
        const overlapsYes = !(
          noButtonRight + minDistanceFromYes <= yesButtonX || // NO is completely to the left
          newX >= yesButtonRight + minDistanceFromYes ||      // NO is completely to the right
          noButtonBottom + minDistanceFromYes <= yesButtonY || // NO is completely above
          newY >= yesButtonBottom + minDistanceFromYes         // NO is completely below
        )
        
        // Also check minimum distance from current position
        const minDistanceFromCurrent = 60
        const farEnoughFromCurrent = (
          Math.abs(newX - noButtonPosition.x) >= minDistanceFromCurrent ||
          Math.abs(newY - noButtonPosition.y) >= minDistanceFromCurrent
        )
        
        if (!overlapsYes && farEnoughFromCurrent) {
          validPosition = true
        }
        
        attempts++
      }
      
      // If we couldn't find a valid position after many attempts, place it in a safe corner
      if (!validPosition) {
        // Try corners that are definitely away from YES button
        const corners = [
          { x: padding, y: padding }, // Top-left
          { x: maxX, y: padding },    // Top-right
          { x: padding, y: maxY },    // Bottom-left
          { x: maxX, y: maxY }        // Bottom-right
        ]
        
        for (const corner of corners) {
          const cornerRight = corner.x + noButtonWidth
          const cornerBottom = corner.y + noButtonHeight
          const yesButtonRight = yesButtonX + yesButtonWidth
          const yesButtonBottom = yesButtonY + yesButtonHeight
          
          const cornerOverlaps = !(
            cornerRight + minDistanceFromYes <= yesButtonX ||
            corner.x >= yesButtonRight + minDistanceFromYes ||
            cornerBottom + minDistanceFromYes <= yesButtonY ||
            corner.y >= yesButtonBottom + minDistanceFromYes
          )
          
          if (!cornerOverlaps) {
            newX = corner.x
            newY = corner.y
            validPosition = true
            break
          }
        }
      }
      
      if (validPosition) {
        setNoButtonPosition({ x: newX, y: newY })
      }
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
            ref={yesButtonRef}
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

