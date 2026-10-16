import React, { StrictMode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const services = [
  {
    icon: '✦',
    label: 'Personalized growth',
    title: 'Private 1-on-1 Sessions',
    short: 'Focused support built around one learner, one goal, and one brilliant pace.',
    description: 'A dedicated mentor meets your learner where they are and builds a clear path forward. Every session blends encouragement, practice, and a plan parents can see.',
    price: '$45',
    color: 'coral',
    features: ['Personal learning plan', 'Weekly progress notes', 'Flexible online or in-person sessions'],
  },
  {
    icon: '⚙',
    label: 'Build & discover',
    title: 'Robotics & STEM Labs',
    short: 'Learn to code, design, and build through challenges that feel like play.',
    description: 'Learners turn ideas into working robots and experiments using Scratch, Python, electronics, and creative problem-solving. No prior experience is needed.',
    price: '$55',
    color: 'blue',
    features: ['Robotics kits provided', 'Team innovation challenges', 'Junior Robotics diploma'],
  },
  {
    icon: '▤',
    label: 'Academic mastery',
    title: 'Full School Subjects',
    short: 'Confident, curriculum-aligned support across the subjects that matter most.',
    description: 'From homework help to exam preparation, our subject specialists make tricky concepts click in Math, Science, English, Physics, Chemistry, and more.',
    price: '$38',
    color: 'mint',
    features: ['Math, science & English', 'Homework and exam prep', 'Progress checks for families'],
  },
]

const teachers = [
  { name: 'Sarah Jenkins', role: 'Math & Physics', bio: 'Turns big equations into small, satisfying wins.', initials: 'SJ', color: 'coral' },
  { name: 'Marcus Chen', role: 'Robotics & Engineering', bio: 'Builds fearless makers one prototype at a time.', initials: 'MC', color: 'blue' },
  { name: 'Elena Rostova', role: 'English & Humanities', bio: 'Helps every voice become a confident story.', initials: 'ER', color: 'mint' },
  { name: 'David Kim', role: 'Biology & Chemistry', bio: 'Makes the world’s best classroom a real lab.', initials: 'DK', color: 'yellow' },
  { name: 'Aisha Patel', role: 'Coding & Game Design', bio: 'Shows young developers how ideas come alive.', initials: 'AP', color: 'lavender' },
]

const studentStories = [
  {
    image: '/public-students.png',
    alt: 'Happy Sally Academy students smiling together',
    quote: 'I used to think I was bad at science. Now I am the person my friends ask for help.',
    initials: 'JM',
    name: 'Jamie M.',
    detail: 'Robotics student · age 13',
    love: 'Building things that actually move and getting to try again when the first idea does not work.',
  },
  {
    image: '/public-hero.png',
    alt: 'Students collaborating on a hands-on learning project',
    quote: 'My tutor makes hard maths feel like a puzzle I can actually solve.',
    initials: 'AR',
    name: 'Alex R.',
    detail: 'Private session student · age 11',
    love: 'Having a plan that makes every small win visible, from homework to the next big test.',
  },
  {
    image: '/public-students.png',
    alt: 'Students exploring a creative project together',
    quote: 'The best part is that my ideas are never too big to try here.',
    initials: 'NK',
    name: 'Noah K.',
    detail: 'STEM lab student · age 15',
    love: 'Working with a team, sharing ideas, and seeing our experiments become something real.',
  },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [booking, setBooking] = useState(null)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [teacherIndex, setTeacherIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [studentStoryIndex, setStudentStoryIndex] = useState(0)
  const teacherTrack = useRef(null)
  const teacherSection = useRef(null)
  const mouseZone = useRef('center')
  const teacherTimer = useRef(null)
  const activeStudentStory = studentStories[studentStoryIndex]

  const changeStudentStory = (direction) => {
    setStudentStoryIndex((current) => (current + direction + studentStories.length) % studentStories.length)
  }
  const teacherHoverPaused = useRef(false)
  const teacherClickPaused = useRef(false)


  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedService(null)
        setBooking(null)
        setSelectedTeacher(null)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const jumpTo = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const shiftTeachers = (direction) => {
    const next = teacherIndex + direction
    if (next < 0) {
      setTeacherIndex(teachers.length - 1)
      const card = teacherTrack.current?.firstElementChild
      const gap = card ? Number.parseFloat(getComputedStyle(teacherTrack.current).gap) || 0 : 0
      teacherTrack.current?.scrollTo({ left: (teachers.length - 1) * ((card?.offsetWidth || 0) + gap), behavior: 'smooth' })
      return
    }
    if (next > teachers.length) return
    if (next === teachers.length) {
      setTeacherIndex(next)
      const card = teacherTrack.current?.firstElementChild
      const gap = card ? Number.parseFloat(getComputedStyle(teacherTrack.current).gap) || 0 : 0
      teacherTrack.current?.scrollTo({ left: next * ((card?.offsetWidth || 0) + gap), behavior: 'smooth' })
      window.setTimeout(() => {
        setTeacherIndex(0)
        teacherTrack.current?.scrollTo({ left: 0, behavior: 'auto' })
      }, 900)
      return
    }
    setTeacherIndex(next)
    const card = teacherTrack.current?.firstElementChild
    const gap = card ? Number.parseFloat(getComputedStyle(teacherTrack.current).gap) || 0 : 0
    teacherTrack.current?.scrollTo({ left: next * ((card?.offsetWidth || 0) + gap), behavior: 'smooth' })
  }

  useEffect(() => {
    teacherTimer.current = window.setInterval(() => {
      shiftTeachers(1)
    }, 4200)

    return () => window.clearInterval(teacherTimer.current)
  }, [teacherIndex])

  const handleTeacherMouseMove = (event) => {
    if (teacherHoverPaused.current || teacherClickPaused.current || window.matchMedia('(pointer: coarse)').matches || !teacherSection.current) return

    const { left, width } = teacherSection.current.getBoundingClientRect()
    const position = (event.clientX - left) / width
    const zone = position < 0.28 ? 'left' : position > 0.72 ? 'right' : 'center'

    if (zone === mouseZone.current) return
    mouseZone.current = zone
    if (zone === 'left') shiftTeachers(-1)
    if (zone === 'right') shiftTeachers(1)
  }

  return (
    <div className="app">
      <header className="site-header">
        <a className="brand" href="#welcome" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">S</span>
          <span><strong>Sally</strong> Academy<small>Curiosity starts here</small></span>
        </a>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
          {['about', 'services', 'reviews', 'teachers', 'leadership'].map((item) => (
            <a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)}>{item === 'reviews' ? 'Student stories' : item === 'leadership' ? 'Our team' : item.replace('-', ' ')}</a>
          ))}
        </nav>
        <div className="header-actions">
          <button className="button button-light hide-mobile" onClick={() => setBooking('Free trial session')}>Free trial</button>
          <button className="button button-primary" onClick={() => setBooking('Academy enrollment')}>Enroll now <span>↗</span></button>
          <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '×' : '☰'}</button>
        </div>
      </header>

      <main>
        <section className="hero section" id="welcome">
          <div className="hero-copy">
            <span className="eyebrow coral-bg">✹ Now enrolling for spring & summer</span>
            <h1>Where curious minds <em>spark big ideas.</em></h1>
            <p className="lead">A joyful place for kids and teens to learn, build, and become more confident in the classroom and beyond.</p>
            <div className="hero-actions">
              <button className="button button-primary large" onClick={() => jumpTo('services')}>Explore programs <span>→</span></button>
              <button className="play-link" onClick={() => setPlaying(true)}><span className="play-icon">▶</span> Watch our story</button>
            </div>
            <div className="proof-row">
              <div className="avatar-stack"><span>✦</span><span>✎</span><span>⚙</span></div>
              <div><strong>4.9 / 5.0 rating</strong><small>Loved by 800+ families</small></div>
              <i />
              <div className="award"><span>✺</span><div><strong>STEM excellence award</strong><small>Certified innovators 2024</small></div></div>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-image-wrap"><img src="/public-hero.png" alt="Students working together in a bright learning studio" /></div>
            <span className="sticker sticker-yellow">Make<br />wonder</span>
            <span className="sticker sticker-blue">+<br />imagine</span>
            <span className="hero-caption"><b>Live workshop</b><br /><strong>Build your first robot</strong></span>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="about-card">
            <span className="big-icon" aria-hidden="true">✦</span>
            <h2>Learning should feel like an <em>unlock.</em></h2>
            <p>Sally Academy is a joyful place where curious learners build confidence through creative, hands-on learning. We are looking for students who are ready to ask questions, try new things, and grow.</p>
          </div>
        </section>

        <section className="section services-section" id="services">
          <div className="section-heading centered"><span className="eyebrow coral-bg">Choose your adventure</span><h2>Big support for <em>bright futures.</em></h2><p>Every program is designed to meet learners at their level and help them take the next brave step.</p></div>
          <div className="service-grid">
            {services.map((service) => (
              <article className={`service-card ${service.color}`} key={service.title}>
                <div><div className="service-top"><span className="service-icon">{service.icon}</span><span className="pill">{service.label}</span></div><h3>{service.title}</h3><p>{service.short}</p></div>
                <div className="service-bottom"><div><strong>{service.price}</strong><span>/ session</span></div><button className="text-button" onClick={() => setSelectedService(service)}>View program <span>→</span></button></div>
              </article>
            ))}
          </div>
          <div className="schedule-callout"><span className="calendar">▦</span><div><strong>Flexible schedules for busy families</strong><p>Monday–Saturday, 3:30–8:00 PM · Weekend bootcamps available</p></div><button className="button button-outline" onClick={() => setBooking('Schedule a campus tour')}>Find a time <span>→</span></button></div>
        </section>

        <section className="section stories-section" id="reviews">
          <div className="section-heading centered"><span className="eyebrow lavender-bg">Student stories</span><h2>What learners love <em>most.</em></h2><p>Don’t just take our word for it. Here’s what happens when curiosity gets room to grow.</p></div>
          <div className="story-grid open-book">
            <div className="story-image"><img key={activeStudentStory.image + studentStoryIndex} src={activeStudentStory.image} alt={activeStudentStory.alt} /><span className="quote-mark">“</span><button className="story-arrow story-arrow-left" onClick={() => changeStudentStory(-1)} aria-label="Previous student story">←</button><button className="story-arrow story-arrow-right" onClick={() => changeStudentStory(1)} aria-label="Next student story">→</button><span className="story-counter">{studentStoryIndex + 1} / {studentStories.length}</span></div>
            <div className="quote-card" key={activeStudentStory.name}><div className="stars">★★★★★</div><blockquote>“{activeStudentStory.quote}”</blockquote><div className="student"><span className="student-avatar">{activeStudentStory.initials}</span><div><strong>{activeStudentStory.name}</strong><small>{activeStudentStory.detail}</small></div></div><div className="love-list"><span>♡</span><div><strong>What {activeStudentStory.name.split(' ')[0]} loves most</strong><p>{activeStudentStory.love}</p></div></div></div>
          </div>
          <button className="video-card" onClick={() => setPlaying(true)}><span className="video-thumb"><img src="/public-hero.png" alt="" /><span className="large-play">▶</span></span><span><small>Watch the student spotlight</small><strong>“Learning here feels like an adventure.”</strong></span><span className="arrow-circle">↗</span></button>
        </section>

        <section className="section teachers-section" id="teachers" ref={teacherSection} onMouseMove={handleTeacherMouseMove} onMouseLeave={() => { mouseZone.current = 'center' }}>
          <div className="section-heading split-heading"><div><span className="eyebrow blue-bg">Meet the mentors</span><h2>People who make learning <em>click.</em></h2><p className="mouse-hint">Move your mouse left or right to browse the mentors.</p></div><div className="slider-controls"><button onClick={() => shiftTeachers(-1)} aria-label="Previous teachers">←</button><button onClick={() => shiftTeachers(1)} aria-label="Next teachers">→</button></div></div>
          <div className="teacher-track" ref={teacherTrack}>
            {[...teachers, ...teachers].map((teacher, index) => <article className="teacher-card" key={`${teacher.name}-${index}`} onMouseEnter={() => { teacherHoverPaused.current = true }} onMouseLeave={() => { teacherHoverPaused.current = false }} onClick={() => { teacherClickPaused.current = !teacherClickPaused.current }}><div className={`teacher-avatar ${teacher.color}`}>{teacher.initials}<span>✓</span></div><h3>{teacher.name}</h3><strong>{teacher.role}</strong><p>“{teacher.bio}”</p><button className="text-button" onClick={(event) => { event.stopPropagation(); setSelectedTeacher(teacher) }}>Meet {teacher.name.split(' ')[0]} <span>→</span></button></article>)}
          </div>
        </section>

        <section className="section leadership-section" id="leadership">
          <div className="section-heading centered"><span className="eyebrow mint-bg">The people behind the place</span><h2>Led with heart, built for <em>possibility.</em></h2></div>
          <div className="leaders">
            <article className="leader-card coral-card"><div className="leader-avatar">SV</div><div><span className="pill">Owner / Manager</span><h3>Sally Vance</h3><strong>Chief educational visionary</strong><p>“Every learner deserves a place where their questions are treated as the beginning of something extraordinary.”</p><button className="button button-primary leader-connect" onClick={() => setBooking('Connect with Sally Vance')}>Connect with us <span>→</span></button></div></article>
            <article className="leader-card blue-card"><div className="leader-avatar">AS</div><div><span className="pill">Owner / Manager</span><h3>Arthur Sterling</h3><strong>Community & operations lead</strong><p>Arthur makes sure every family feels welcomed, every teacher is supported, and every day runs smoothly.</p><button className="button button-primary leader-connect" onClick={() => setBooking('Connect with Arthur Sterling')}>Connect with us <span>→</span></button></div></article>
          </div>
        </section>
      </main>

      <footer><div className="brand"><span className="brand-mark">S</span><span><strong>Sally</strong> Academy<small>Curiosity starts here</small></span></div><p>Helping bright ideas find their way into the world.</p><span>© 2024 Sally Academy</span></footer>

      {selectedService && <div className="modal-backdrop" onClick={() => setSelectedService(null)}><div className="modal service-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedService(null)}>×</button><span className={`service-icon ${selectedService.color}`}>{selectedService.icon}</span><span className="eyebrow">{selectedService.label}</span><h2>{selectedService.title}</h2><p>{selectedService.description}</p><ul>{selectedService.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul><div className="modal-price"><strong>{selectedService.price}</strong><span>per session · monthly plans available</span></div><button className="button button-primary large" onClick={() => { setSelectedService(null); setBooking(selectedService.title) }}>Subscribe to this program <span>→</span></button></div></div>}
      {selectedTeacher && <div className="modal-backdrop" onClick={() => setSelectedTeacher(null)}><div className="modal teacher-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedTeacher(null)}>×</button><div className={`teacher-modal-avatar ${selectedTeacher.color}`}>{selectedTeacher.initials}<span>✓</span></div><span className="eyebrow blue-bg">Sally Academy mentor</span><h2>{selectedTeacher.name}</h2><strong className="teacher-modal-role">{selectedTeacher.role}</strong><p className="teacher-modal-bio">“{selectedTeacher.bio}”</p><div className="teacher-modal-details"><span>✓ Verified mentor</span><span>★ 4.9 average rating</span><span>⌁ Flexible session times</span></div></div></div>}
      {booking && <div className="modal-backdrop" onClick={() => setBooking(null)}><div className="modal booking-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setBooking(null)}>×</button><span className="eyebrow coral-bg">Let’s get started</span><h2>Find the right fit.</h2><p>Tell us a little about your learner and our team will be in touch within one school day about <strong>{booking}</strong>.</p><form onSubmit={(event) => { event.preventDefault(); setBooking('Thanks! We’ll be in touch soon.') }}><label>Your name<input required placeholder="Parent or guardian name" /></label><label>Email address<input required type="email" placeholder="you@example.com" /></label><label>Learner’s age<select defaultValue=""><option value="" disabled>Select age</option><option>6–8</option><option>9–12</option><option>13–15</option><option>16–18</option></select></label><button className="button button-primary large" type="submit">Request a call <span>→</span></button></form></div></div>}
      {playing && <div className="modal-backdrop" onClick={() => setPlaying(false)}><div className="modal video-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setPlaying(false)}>×</button><div className="video-placeholder"><span className="large-play">▶</span><strong>Sally Academy in action</strong><small>Video tour coming soon</small></div></div></div>}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
