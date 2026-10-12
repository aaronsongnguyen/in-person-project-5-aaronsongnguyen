// Week 7: Migrating Your Interactive Portfolio to React
// The Week 6 portfolio (index.html + styles.css + script.js) migrated into ONE component.
// Reference copies of the original Week 6 files live in my-week6/.

import { useEffect } from 'react'
import './App.css'

function App() {
  // ============================================
  // PART 1: EVENT HANDLER FUNCTIONS
  // ============================================

  // --- Smooth scroll navigation ---
  // Week 6: navLinks.forEach(link => link.addEventListener('click', ...))
  const handleNavClick = (e) => {
    e.preventDefault()

    const targetId = e.currentTarget.getAttribute('href')
    const targetSection = document.querySelector(targetId)

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // Close the mobile menu after picking a link (Week 6 did this too)
    document.querySelector('.nav-menu').classList.remove('active')
    document.querySelector('.nav-toggle').classList.remove('active')
  }

  // --- Active nav highlighting on scroll ---
  // Week 6: window.addEventListener('scroll', ...)
  const handleScroll = () => {
    const sections = document.querySelectorAll('section')
    const scrollPos = window.scrollY + 100

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute('id')

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach((link) => link.classList.remove('active'))

        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`)
        if (activeLink) {
          activeLink.classList.add('active')
        }
      }
    })
  }

  // Attach the window listener once on load, remove it on unload (README Part 4 Step 4).
  // Calling window.addEventListener directly in the component body would add a new
  // listener on every render, so it lives inside useEffect instead.
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // --- Project filtering ---
  // Week 6: filterButtons.forEach(button => button.addEventListener('click', ...))
  const filterProjects = (category) => {
    const projectCards = document.querySelectorAll('.project-card')

    projectCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category')

      if (category === 'all' || cardCategory === category) {
        card.style.display = 'block'
      } else {
        card.style.display = 'none'
      }
    })
  }

  const handleFilterClick = (e) => {
    document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'))
    e.currentTarget.classList.add('active')

    const filterValue = e.currentTarget.getAttribute('data-filter')
    filterProjects(filterValue)
  }

  // --- Mobile menu toggle ---
  // Week 6: navToggle.addEventListener('click', ...)
  const handleMobileMenuToggle = () => {
    document.querySelector('.nav-menu').classList.toggle('active')
    document.querySelector('.nav-toggle').classList.toggle('active')
  }

  // --- Form validation helpers (unchanged from Week 6) ---
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const clearError = (input) => {
    const error = input.parentElement.querySelector('.error-message')
    if (error) {
      error.remove()
    }
    input.classList.remove('error')
  }

  const showError = (input, message) => {
    clearError(input)

    const error = document.createElement('span')
    error.className = 'error-message'
    error.textContent = message

    input.classList.add('error')
    input.classList.remove('success')

    input.parentElement.appendChild(error)
  }

  const showSuccess = (input) => {
    clearError(input)
    input.classList.add('success')
    input.classList.remove('error')
  }

  // One validator per field, shared by the live (onChange) checks and the submit check
  const validateName = (input) => {
    if (input.value.trim().length < 2) {
      showError(input, 'Name must be at least 2 characters')
      return false
    }
    showSuccess(input)
    return true
  }

  const validateEmail = (input) => {
    if (!isValidEmail(input.value)) {
      showError(input, 'Please enter a valid email address')
      return false
    }
    showSuccess(input)
    return true
  }

  const validateMessage = (input) => {
    if (input.value.trim().length < 10) {
      showError(input, 'Message must be at least 10 characters')
      return false
    }
    showSuccess(input)
    return true
  }

  // --- Real-time validation ---
  // Week 6: nameInput.addEventListener('input', ...) etc.
  // React's onChange fires on every keystroke, like the native 'input' event.
  const handleNameInput = (e) => validateName(e.currentTarget)
  const handleEmailInput = (e) => validateEmail(e.currentTarget)
  const handleMessageInput = (e) => validateMessage(e.currentTarget)

  // --- Form submit ---
  // Week 6: contactForm.addEventListener('submit', ...)
  const handleFormSubmit = (e) => {
    e.preventDefault()

    const contactForm = e.currentTarget
    const nameInput = document.querySelector('#name')
    const emailInput = document.querySelector('#email')
    const messageInput = document.querySelector('#message')

    // Run every validator (no short-circuit) so all errors show at once
    const nameOk = validateName(nameInput)
    const emailOk = validateEmail(emailInput)
    const messageOk = validateMessage(messageInput)
    const isValid = nameOk && emailOk && messageOk

    if (isValid) {
      const successMsg = document.createElement('div')
      successMsg.className = 'success-message'
      successMsg.textContent = 'Thank you! Your message has been sent successfully.'

      contactForm.appendChild(successMsg)

      setTimeout(() => {
        contactForm.reset()
        successMsg.remove()
        document.querySelectorAll('.success').forEach((input) => {
          input.classList.remove('success')
        })
      }, 3000)
    }
  }

  // Note: Week 6's animateSkills() is intentionally left out. The --skill-level
  // custom property on each .skill-progress drives the CSS width and fill animation.

  // ============================================
  // PART 2: JSX RETURN STATEMENT
  // ============================================
  return (
    <div className="portfolio">
      {/* Navigation Bar */}
      <nav id="navbar">
        <div className="nav-brand">
          <span>Aaron Nguyen</span>
        </div>
        <ul className="nav-menu">
          <li><a href="#home" className="nav-link" onClick={handleNavClick}>Home</a></li>
          <li><a href="#about" className="nav-link" onClick={handleNavClick}>About</a></li>
          <li><a href="#skills" className="nav-link" onClick={handleNavClick}>Skills</a></li>
          <li><a href="#projects" className="nav-link" onClick={handleNavClick}>Projects</a></li>
          <li><a href="#contact" className="nav-link" onClick={handleNavClick}>Contact</a></li>
        </ul>
        {/* Mobile menu toggle */}
        <div className="nav-toggle" onClick={handleMobileMenuToggle}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Aaron Nguyen</h1>
          <p className="hero-subtitle">CS &amp; Data Science Student at UC Berkeley</p>
          <p className="hero-tagline">Building AI agents and the backend systems that run them</p>
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">View Projects</a>
            <a href="#contact" className="btn btn-secondary">Get In Touch</a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <h2>About Me</h2>
          <div className="about-grid">
            <div className="about-text">
              <p>I'm a Computer Science and Data Science major at UC Berkeley, graduating in May 2028. Most of what I work on is AI agents and the backend systems that run them. I've interned at Illumio, Screenz AI, and NVIDIA. On campus I'm in DiversaTech and the Vietnamese Student Association, and I'm an Eagle Scout.</p>
              <div className="about-details">
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span>Berkeley, CA</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">✉️</span>
                  <a href="mailto:airrock85@berkeley.edu">airrock85@berkeley.edu</a>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">💻</span>
                  <a href="https://github.com/aaronsongnguyen">github.com/aaronsongnguyen</a>
                </div>
              </div>
            </div>
            <div className="about-availability">
              <h3>Currently Available For:</h3>
              <div className="availability-tags">
                <span className="tag tag-available">Internships</span>
                <span className="tag tag-available">Part-Time</span>
                <span className="tag tag-available">Remote</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section section-alt">
        <div className="container">
          <h2>Skills &amp; Technologies</h2>
          <div className="skills-grid">
            <div className="skill-card">
              <div className="skill-header">
                <span className="skill-icon">🐍</span>
                <h3 className="skill-name">Python</h3>
              </div>
              <div className="skill-category">Programming</div>
              <div className="skill-level">
                <div className="skill-progress" style={{ '--skill-level': '95%' }}></div>
              </div>
              <span className="skill-percentage">95%</span>
            </div>

            <div className="skill-card">
              <div className="skill-header">
                <span className="skill-icon">🤖</span>
                <h3 className="skill-name">LLM Agents &amp; RAG</h3>
              </div>
              <div className="skill-category">AI</div>
              <div className="skill-level">
                <div className="skill-progress" style={{ '--skill-level': '90%' }}></div>
              </div>
              <span className="skill-percentage">90%</span>
            </div>

            <div className="skill-card">
              <div className="skill-header">
                <span className="skill-icon">🚀</span>
                <h3 className="skill-name">JavaScript / TypeScript</h3>
              </div>
              <div className="skill-category">Programming</div>
              <div className="skill-level">
                <div className="skill-progress" style={{ '--skill-level': '85%' }}></div>
              </div>
              <span className="skill-percentage">85%</span>
            </div>

            <div className="skill-card">
              <div className="skill-header">
                <span className="skill-icon">⚛️</span>
                <h3 className="skill-name">React &amp; Next.js</h3>
              </div>
              <div className="skill-category">Frontend Framework</div>
              <div className="skill-level">
                <div className="skill-progress" style={{ '--skill-level': '80%' }}></div>
              </div>
              <span className="skill-percentage">80%</span>
            </div>

            <div className="skill-card">
              <div className="skill-header">
                <span className="skill-icon">🌐</span>
                <h3 className="skill-name">Node.js &amp; Express</h3>
              </div>
              <div className="skill-category">Backend</div>
              <div className="skill-level">
                <div className="skill-progress" style={{ '--skill-level': '80%' }}></div>
              </div>
              <span className="skill-percentage">80%</span>
            </div>

            <div className="skill-card">
              <div className="skill-header">
                <span className="skill-icon">☸️</span>
                <h3 className="skill-name">Docker &amp; Kubernetes</h3>
              </div>
              <div className="skill-category">Infrastructure</div>
              <div className="skill-level">
                <div className="skill-progress" style={{ '--skill-level': '75%' }}></div>
              </div>
              <span className="skill-percentage">75%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <div className="container">
          <h2>Featured Projects</h2>

          <div className="filter-buttons">
            <button className="filter-btn active" data-filter="all" onClick={handleFilterClick}>All Projects</button>
            <button className="filter-btn" data-filter="frontend" onClick={handleFilterClick}>Frontend</button>
            <button className="filter-btn" data-filter="fullstack" onClick={handleFilterClick}>Full-Stack</button>
            <button className="filter-btn" data-filter="design" onClick={handleFilterClick}>Design</button>
            <button className="filter-btn" data-filter="webapp" onClick={handleFilterClick}>Web App</button>
          </div>

          <div className="projects-grid">
            <div className="project-card featured" data-category="fullstack">
              <div className="project-image">
                <img src="https://placehold.co/400x250/4f46e5/ffffff?text=Field+Medic" alt="Field Medic" />
                <div className="project-overlay">
                  <div className="project-links">
                    <a href="https://github.com/aaronsongnguyen" className="project-link">
                      <span>💻</span> Code
                    </a>
                  </div>
                </div>
              </div>
              <div className="project-content">
                <div className="project-header">
                  <h3 className="project-title">Field Medic</h3>
                  <span className="project-category">Full-Stack</span>
                </div>
                <p className="project-description">Top 3 at the Google/Qualcomm hackathon. An offline AI first-aid assistant for Android that uses the camera, speech-to-text, and on-device models to walk you through first aid with no internet.</p>
                <div className="project-tags">
                  <span className="project-tag">Java</span>
                  <span className="project-tag">Android</span>
                  <span className="project-tag">Gemma</span>
                  <span className="project-tag">LiteRT</span>
                </div>
              </div>
            </div>

            <div className="project-card" data-category="frontend">
              <div className="project-image">
                <img src="https://placehold.co/400x250/059669/ffffff?text=Data-Driven+Portfolio" alt="Data-Driven Portfolio" />
                <div className="project-overlay">
                  <div className="project-links">
                    <a href="https://github.com/aaronsongnguyen/in-person-project-3-aaronsongnguyen" className="project-link">
                      <span>💻</span> Code
                    </a>
                  </div>
                </div>
              </div>
              <div className="project-content">
                <div className="project-header">
                  <h3 className="project-title">Data-Driven Portfolio</h3>
                  <span className="project-category">Frontend</span>
                </div>
                <p className="project-description">A portfolio where all of the content lives in JavaScript objects and arrays and the page is rendered with template literals.</p>
                <div className="project-tags">
                  <span className="project-tag">HTML</span>
                  <span className="project-tag">CSS</span>
                  <span className="project-tag">JavaScript</span>
                </div>
              </div>
            </div>

            <div className="project-card" data-category="webapp">
              <div className="project-image">
                <img src="https://placehold.co/400x250/dc2626/ffffff?text=Interactive+Portfolio" alt="Interactive Portfolio" />
                <div className="project-overlay">
                  <div className="project-links">
                    <a href="https://github.com/aaronsongnguyen/in-person-project-4-aaronsongnguyen" className="project-link">
                      <span>💻</span> Code
                    </a>
                  </div>
                </div>
              </div>
              <div className="project-content">
                <div className="project-header">
                  <h3 className="project-title">Interactive Portfolio</h3>
                  <span className="project-category">Web App</span>
                </div>
                <p className="project-description">This site. Smooth scrolling, project filtering, animated skill bars, and real-time form validation built with plain DOM APIs and events.</p>
                <div className="project-tags">
                  <span className="project-tag">JavaScript</span>
                  <span className="project-tag">DOM</span>
                  <span className="project-tag">Events</span>
                </div>
              </div>
            </div>

            <div className="project-card" data-category="design">
              <div className="project-image">
                <img src="https://placehold.co/400x250/7c3aed/ffffff?text=Task+Manager+UI" alt="Task Manager UI" />
                <div className="project-overlay">
                  <div className="project-links">
                    <a href="https://github.com/aaronsongnguyen" className="project-link">
                      <span>💻</span> Code
                    </a>
                  </div>
                </div>
              </div>
              <div className="project-content">
                <div className="project-header">
                  <h3 className="project-title">Task Manager UI</h3>
                  <span className="project-category">Design</span>
                </div>
                <p className="project-description">The look and feel of a task manager app, built from a design mockup with semantic HTML and CSS.</p>
                <div className="project-tags">
                  <span className="project-tag">HTML5</span>
                  <span className="project-tag">CSS3</span>
                  <span className="project-tag">Figma</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section section-alt">
        <div className="container">
          <h2>Get In Touch</h2>
          <div className="contact-content">
            <p>I'm always interested in hearing about new opportunities and projects. Feel free to reach out!</p>

            <form id="contact-form" className="contact-form" onSubmit={handleFormSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input type="text" id="name" name="name" required onChange={handleNameInput} />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input type="email" id="email" name="email" required onChange={handleEmailInput} />
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" name="subject" />
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="message">Message *</label>
                  <textarea id="message" name="message" rows="5" required onChange={handleMessageInput}></textarea>
                </div>

                <div className="form-group form-group-full">
                  <button type="submit" className="btn btn-primary">Send Message</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2026 Aaron Nguyen. All rights reserved.</p>
            <div className="social-links">
              <a href="https://github.com/aaronsongnguyen" className="social-link">GitHub</a>
              <a href="https://linkedin.com/in/aaron-nguyen1" className="social-link">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
