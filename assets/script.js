<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>My Portfolio</title>
  <link rel="stylesheet" href="style.css" />
  <meta name="description" content="Portfolio of [RATHENESH S G] - Developer, Designer, Creator" />
</head>
<body>
  <header class="site-header">
    <div class="container">
      <h1 class="logo">RATHENESH S G</h1>
      <nav class="nav">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
        <button id="theme-toggle" aria-label="Toggle dark/light">🌙</button>
      </nav>
    </div>
  </header>

  <section id="hero" class="hero animated-gradient">
    <div class="container fade-in">
      <div class="hero-text">
        <h2>Hi, I'm <span class="highlight">RATHENESH S G</span></h2>
        <p>Computer Science engineering student with strong skills in programming, debugging, and web/game development. Passionate about AI/ML, C#, and Unity game development.</p>
        <ul style="list-style:none; padding:0; margin:1rem 0;">
          <li>📞 <a href="tel:+919342616608">+91 9342616608</a></li>
          <li>✉️ <a href="mailto:ratheneshsg@gmail.com">ratheneshsg@gmail.com</a></li>
          <li>🏠 385A/4 Periyar nagar, Gandhigrammam, Karur</li>
          <li>
            <a href="https://github.com/S-G-Rathenesh" target="_blank" rel="noopener">GitHub</a> |
            <a href="https://www.linkedin.com/in/rathenesh-s-g" target="_blank" rel="noopener">LinkedIn</a>
          </li>
        </ul>
        <a href="#projects" class="btn">View Projects</a>
      </div>
      <div class="hero-image">
        <img src="C:\Users\gnana\Downloads\me.jpg" alt="Photo of RATHENESH S G" class="profile-img" />
      </div> 
    </div>
  </section>

  <section id="about" class="section fade-in">
    <div class="container">
      <h2>About Me</h2>
      <p>
        <strong>EDUCATIONAL SUMMARY:</strong><br>
        <b>Degree:</b> Bachelor of Computer Science and Engineering (2023 – 2027)<br>
        <b>Institution:</b> M.Kumarasamy College of Engineering<br>
        <b>Cumulative Grade Point Average:</b> 7.384 (Till 4<sup>th</sup> Semester)
      </p>
      <h3>Technical Skills</h3>
      <ul class="skills">
        <li>Python (Intermediate)</li>
        <li>HTML, PHP, CSS & SQL-XAMPP (Intermediate)</li>
        <li>Java (Basic)</li>
        <li>C# (Basic)</li>
        <li>Unity Game Engine (Beginner)</li>
      </ul>
      <h3>Soft Skills</h3>
      <ul class="skills">
        <li>Adaptability & Continuous Learning</li>
        <li>Teamwork & Collaboration</li>
      </ul>
      <h3>Languages Known</h3>
      <ul class="skills">
        <li>Tamil</li>
        <li>English</li>
      </ul>
      <h3>Area of Interest</h3>
      <ul class="skills">
        <li>Web Development</li>
        <li>Game Development</li>
      </ul>
      <h3>Hobbies</h3>
      <ul class="skills">
        <li>Reading Manhwa</li>
        <li>Work with Unity</li>
        <li>Game logic</li>
      </ul>
    </div>
  </section>

  <section id="projects" class="section alt fade-in">
    <div class="container">
      <h2>Projects</h2>
      <div class="project-grid">
        <div class="project-card">
          <h3>Inventory Management System</h3>
          <ul style="font-size:0.95em; margin-bottom:0.5em;">
            <li><b>Duration:</b> Jan 2025 – Apr 2025</li>
            <li><b>Team Size:</b> 1</li>
            <li><b>Role:</b> Fullstack Developer</li>
            <li><b>Technologies:</b> HTML, CSS, PHP, MySQL, XAMPP</li>
          </ul>
          <p>To manage the stocks in the shop.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="internship" class="section fade-in">
    <div class="container">
      <h2>Internship</h2>
      <ul>
        <li><b>Company Name:</b> HDLC Technologies</li>
        <li><b>Tools Learned:</b> Jupyter Notebook, Google Colab</li>
        <li><b>Duration:</b> 15 days</li>
        <li><b>Role:</b> AI Developer</li>
      </ul>
    </div>
  </section>

  <section id="certifications" class="section alt fade-in">
    <div class="container">
      <h2>Certifications & Activities</h2>
      <ul>
        <li>Certification in Introduction to Basic Game Development</li>
        <li>Certification in Build a Full Website using WordPress</li>
        <li>Attended a Flutter App Development Workshop conducted by Kongu Engineering College</li>
        <li>English Typewriting (Junior)</li>
      </ul>
    </div>
  </section>

  <section id="contact" class="section fade-in">
    <div class="container">
      <h2>Contact</h2>
      <p>Want to work together or ask something? Reach out!</p>
      <form id="contact-form" action="mailto:ratheneshsg@gmail.com" method="post" enctype="text/plain">
        <input type="text" name="name" placeholder="Your name" required />
        <input type="email" name="email" placeholder="Your email" required />
        <textarea name="message" rows="5" placeholder="Message" required></textarea>
        <button type="submit" class="btn">Send</button>
      </form>
      <p class="small">Or email me directly at <a href="mailto:ratheneshsg@gmail.com">ratheneshsg@gmail.com</a></p>
    </div>
  </section>

  <footer class="site-footer fade-in">
    <div class="container">
      <p>&copy; <span id="year"></span> RATHENESH S G. Built with HTML, CSS & JavaScript.</p>
      <div class="social">
        <a href="https://github.com/S-G-Rathenesh" aria-label="GitHub" target="_blank" rel="noopener">GitHub</a>
        <a href="https://www.linkedin.com/in/rathenesh-s-g" aria-label="LinkedIn" target="_blank" rel="noopener">LinkedIn</a>
      </div>
    </div>
  </footer>

  <script src="assets/script.js"></script>
  <script>
    // Fade-in animation on scroll
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));
  </script>
</body>
</html>