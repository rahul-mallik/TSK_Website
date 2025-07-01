// Custom Cursor
const cursorDot = document.querySelector(".cursor-dot")
const cursorRing = document.querySelector(".cursor-ring")
const cursorGlow = document.querySelector(".cursor-glow")

let mouseX = 0
let mouseY = 0
let ringX = 0
let ringY = 0
let glowX = 0
let glowY = 0

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
})

function updateCursor() {
  // Dot follows immediately
  cursorDot.style.left = mouseX + "px"
  cursorDot.style.top = mouseY + "px"

  // Ring follows with slight delay
  ringX += (mouseX - ringX) * 0.15
  ringY += (mouseY - ringY) * 0.15
  cursorRing.style.left = ringX - 16 + "px"
  cursorRing.style.top = ringY - 16 + "px"

  // Glow follows with more delay
  glowX += (mouseX - glowX) * 0.1
  glowY += (mouseY - glowY) * 0.1
  cursorGlow.style.left = glowX - 12 + "px"
  cursorGlow.style.top = glowY - 12 + "px"

  requestAnimationFrame(updateCursor)
}

updateCursor()

// Interactive Flowers
function createFlower(x, y) {
  const flower = document.createElement("div")
  flower.className = "flower"
  flower.style.left = x + "px"
  flower.style.top = y + "px"

  const colors = ["#FFD700", "#FF8C00", "#FF6347", "#DAA520"]
  const color = colors[Math.floor(Math.random() * colors.length)]

  flower.innerHTML = `
        <div class="petal" style="background: ${color}; transform: rotate(0deg)"></div>
        <div class="petal" style="background: ${color}; transform: rotate(45deg)"></div>
        <div class="petal" style="background: ${color}; transform: rotate(90deg)"></div>
        <div class="petal" style="background: ${color}; transform: rotate(135deg)"></div>
        <div class="center" style="background: #8B4513"></div>
    `

  flower.style.cssText += `
        position: absolute;
        width: 20px;
        height: 20px;
        pointer-events: none;
        animation: bloom 0.6s ease-out forwards;
    `

  const petals = flower.querySelectorAll(".petal")
  petals.forEach((petal) => {
    petal.style.cssText += `
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50% 0;
            top: 50%;
            left: 50%;
            transform-origin: 0 0;
            opacity: 0.8;
        `
  })

  const center = flower.querySelector(".center")
  center.style.cssText += `
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `

  document.getElementById("flowers").appendChild(flower)

  setTimeout(() => {
    flower.style.animation = "fadeOut 2s ease-out forwards"
    setTimeout(() => {
      flower.remove()
    }, 2000)
  }, 3000)
}

// Add CSS for flower animations
const flowerStyles = `
    @keyframes bloom {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
        }
        50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: scale(1) rotate(360deg);
            opacity: 0.8;
        }
    }
    
    @keyframes fadeOut {
        0% {
            opacity: 0.8;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.5);
        }
    }
`

const styleSheet = document.createElement("style")
styleSheet.textContent = flowerStyles
document.head.appendChild(styleSheet)

// Click to create flowers
document.addEventListener("click", (e) => {
  createFlower(e.clientX - 10, e.clientY - 10)
})

// Navbar scroll effect
const navbar = document.getElementById("navbar")
if (navbar) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// FIXED COUNTING ANIMATION FOR STATS
function animateCounter(element, target, duration = 2000) {
  const start = 0
  const increment = target / (duration / 16)
  let current = start

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }

    // Handle different number formats
    if (target >= 1000) {
      element.textContent = Math.floor(current / 1000) + "k+"
    } else if (target === 4.9) {
      element.textContent = current.toFixed(1) + "/5"
    } else if (target === 98) {
      element.textContent = Math.floor(current) + "%"
    } else if (target === 75) {
      element.textContent = Math.floor(current) + "k+"
    } else {
      element.textContent = Math.floor(current) + "+"
    }
  }, 16)
}

// Enhanced Intersection Observer for animations with slide up fade
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")

      // Animate counters when they come into view
      if (entry.target.classList.contains("stat-number")) {
        const dataCount = entry.target.getAttribute("data-count")
        const target = Number.parseInt(dataCount) || 0
        if (target > 0) {
          animateCounter(entry.target, target)
        }
      }
    } else {
      // Remove visible class when element goes out of view for re-animation
      if (
        entry.target.classList.contains("slide-up-fade") ||
        entry.target.classList.contains("slide-up-fade-delay-1") ||
        entry.target.classList.contains("slide-up-fade-delay-2") ||
        entry.target.classList.contains("slide-up-fade-delay-3")
      ) {
        entry.target.classList.remove("visible")
      }
    }
  })
}, observerOptions)

// Observe elements for animation
document
  .querySelectorAll(
    ".fade-in, .slide-in-left, .slide-in-right, .scale-in, .stat-number, .slide-up-fade, .slide-up-fade-delay-1, .slide-up-fade-delay-2, .slide-up-fade-delay-3",
  )
  .forEach((el) => {
    observer.observe(el)
  })

// Auto-add slide up fade classes to text elements
document.addEventListener("DOMContentLoaded", () => {
  // Add slide up fade to headings
  document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading, index) => {
    const delayClass =
      index % 4 === 0
        ? "slide-up-fade"
        : index % 4 === 1
          ? "slide-up-fade-delay-1"
          : index % 4 === 2
            ? "slide-up-fade-delay-2"
            : "slide-up-fade-delay-3"
    heading.classList.add(delayClass)
    observer.observe(heading)
  })

  // Add slide up fade to paragraphs
  document.querySelectorAll("p").forEach((p, index) => {
    const delayClass =
      index % 4 === 0
        ? "slide-up-fade"
        : index % 4 === 1
          ? "slide-up-fade-delay-1"
          : index % 4 === 2
            ? "slide-up-fade-delay-2"
            : "slide-up-fade-delay-3"
    p.classList.add(delayClass)
    observer.observe(p)
  })

  // Add slide up fade to cards
  document
    .querySelectorAll(".event-card, .gallery-item, .testimonial-card, .team-card, .contact-card")
    .forEach((card, index) => {
      const delayClass =
        index % 4 === 0
          ? "slide-up-fade"
          : index % 4 === 1
            ? "slide-up-fade-delay-1"
            : index % 4 === 2
              ? "slide-up-fade-delay-2"
              : "slide-up-fade-delay-3"
      card.classList.add(delayClass)
      observer.observe(card)
    })
})

// Contact form handling
const contactForm = document.getElementById("contactForm")
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const formData = new FormData(this)
    const name = formData.get("name")
    const email = formData.get("email")
    const subject = formData.get("subject")
    const message = formData.get("message")

    // Create mailto link
    const mailtoLink = `mailto:soadramaticsclub@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`

    // Open email client
    window.location.href = mailtoLink

    // Show success message
    const formStatus = document.getElementById("formStatus")
    formStatus.style.display = "block"
    formStatus.className = "form-status success"
    formStatus.textContent = "Email client opened! Please send the email to complete your message."

    // Reset form
    this.reset()

    // Hide status after 5 seconds
    setTimeout(() => {
      formStatus.style.display = "none"
    }, 5000)
  })
}

// Lightbox functionality for gallery
function openLightbox(imageSrc, title, description) {
  const lightbox = document.getElementById("lightbox")
  const lightboxImage = document.getElementById("lightbox-image")
  const lightboxTitle = document.getElementById("lightbox-title")
  const lightboxDescription = document.getElementById("lightbox-description")

  if (lightbox && lightboxImage && lightboxTitle && lightboxDescription) {
    lightboxImage.src = imageSrc
    lightboxTitle.textContent = title
    lightboxDescription.textContent = description
    lightbox.style.display = "flex"
    document.body.style.overflow = "hidden"
  }
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox")
  if (lightbox) {
    lightbox.style.display = "none"
    document.body.style.overflow = "auto"
  }
}

// Close lightbox on background click
document.addEventListener("click", (e) => {
  const lightbox = document.getElementById("lightbox")
  if (lightbox && e.target === lightbox) {
    closeLightbox()
  }
})

// Close lightbox on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox()
  }
})

// Add scroll indicator functionality
const scrollIndicator = document.querySelector(".scroll-indicator")
if (scrollIndicator) {
  scrollIndicator.addEventListener("click", () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    })
  })
}

// Mobile menu toggle
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    })
  })
}

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")
})

// Performance optimization: Throttle scroll events
let ticking = false

function updateScrollEffects() {
  // Update navbar
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  }

  ticking = false
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateScrollEffects)
    ticking = true
  }
})

// Add hover effects for buttons
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    cursorRing.style.transform = "scale(1.5)"
    cursorGlow.style.transform = "scale(2)"
  })

  btn.addEventListener("mouseleave", () => {
    cursorRing.style.transform = "scale(1)"
    cursorGlow.style.transform = "scale(1)"
  })
})

// Add parallax effect to floating particles
const particles = document.querySelectorAll(".floating-particle")
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  particles.forEach((particle, index) => {
    const rate = scrolled * -0.5 * (index + 1) * 0.1
    particle.style.transform = `translateY(${rate}px)`
  })
})

console.log("🎭 TONEELSTUK - Website Loaded Successfully! 🎭")
