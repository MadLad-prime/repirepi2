document.addEventListener('DOMContentLoaded', () => {
    // --- Existing Variables ---
    const header = document.querySelector('.main-header');
    const hamburger = document.querySelector('.hamburger');
    // TARGET THE SCROLL WRAPPER INSTEAD for the main mobile menu interaction, IF using dropdown
    // const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const yearSpan = document.getElementById('current-year');
    const sections = document.querySelectorAll('.content-section'); // Content sections for scroll fade
    const heroCanvas = document.getElementById('particle-canvas');
    const heroTitleSpans = document.querySelectorAll('.hero-title span');

    // --- Navbar Scroll Effect ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Hamburger Menu Toggle ---
    // DECIDE: If you keep horizontal scroll on mobile, hamburger might not be needed
    // OR it could toggle a DIFFERENT mobile-only vertical menu.
    // The CSS above keeps the scroll bar on mobile for now.
    // If you change to a dropdown, this JS needs to target `.nav-menu` again.
    if (hamburger) {
         const navMenuActual = document.querySelector('.nav-menu'); // Need this reference for closing
         hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            // This controls the visual X of the button
            // If you implement a dropdown, toggle .active on navMenuActual here:
            // navMenuActual.classList.toggle('active');
        });

        // --- Close Dropdown Menu When Link Is Clicked (Only if using dropdown) ---
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Check if the dropdown menu is active before trying to close
                // if (navMenuActual.classList.contains('active')) {
                //    hamburger.classList.remove('active');
                //    navMenuActual.classList.remove('active');
                // }

                // For scroll nav, ensure clicking focuses the link area if needed
                // But generally just scrolling to the section is fine
            });
        });
    }


     // --- Active Nav Link Highlighting (Improved Robustness Needed) ---
     // Simple version - might need tweaking, especially with many links/sections
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        let offset = header.clientHeight + 50; // Offset based on header + a bit more

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Consider visible part of section for activation
            if (pageYOffset >= sectionTop - offset && pageYOffset < sectionTop + sectionHeight - offset ) {
                 currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
             const linkHref = link.getAttribute('href');
             // Match both '#sectionId' and '/page#sectionId' styles
            if(linkHref && linkHref.includes(`#${currentSectionId}`) && currentSectionId !== '') {
                link.classList.add('active');
                 // Scroll the active link into view in the horizontal nav
                 link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                link.classList.remove('active');
            }
        });

        // If at top, remove all active states or activate a 'Home' link if you have one
         if (pageYOffset < window.innerHeight * 0.6) { // Adjusted threshold for top detection
            // Potentially add back 'active' to the first relevant link if desired
             // navLinks[0]?.classList.add('active'); // Example: Activate first link
             if (!currentSectionId) { // Only remove if no other section is active
                navLinks.forEach(link => link.classList.remove('active'));
            }
         }
    }, { passive: true }); // Optimize scroll listener slightly


    // --- Set Current Year in Footer ---
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Section Fade-in Animation on Scroll ---
    const sectionObserverOptions = {
        root: null, threshold: 0.15 // Trigger a bit later
    };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                 // Optional: Stop observing once visible to save resources
                 // observer.unobserve(entry.target);
            } else {
                 // Optional: Remove if you want fade-out effect on scroll up
                 // entry.target.classList.remove('visible');
            }
        });
    }, sectionObserverOptions);
    sections.forEach(section => sectionObserver.observe(section));


    // --- Particle Animation Enhancements (Subtle Mouse Interaction) ---
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        let particles = [];
        let canvasWidth, canvasHeight;
        const mouse = { x: null, y: null, radius: 80 }; // Mouse influence radius

         window.addEventListener('mousemove', (event) => {
             const rect = heroCanvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
         });
         window.addEventListener('mouseout', () => {
             mouse.x = null;
             mouse.y = null;
         })


        function resizeCanvas() {
            canvasWidth = heroCanvas.width = heroCanvas.offsetWidth;
            canvasHeight = heroCanvas.height = heroCanvas.offsetHeight;
             initParticles(Math.min(Math.floor(canvasWidth * canvasHeight / 15000), 75)); // Adjust particle density, max 75
        }
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvasWidth;
                this.y = Math.random() * canvasHeight;
                this.baseX = this.x; // Remember original position (optional)
                this.baseY = this.y; // Remember original position (optional)
                this.size = Math.random() * 2.5 + 1; // Smaller particles overall
                this.baseSpeed = 0.3; // Slower base speed
                this.speedX = Math.random() * this.baseSpeed * 2 - this.baseSpeed;
                this.speedY = Math.random() * this.baseSpeed * 2 - this.baseSpeed;
                 // Use a gradient or palette for colors?
                 //this.color = `hsla(${Math.random() * 60 + 180}, 100%, 70%, 0.6)`; // Cyan/Blue hues
                this.color = Math.random() > 0.5 ? 'rgba(0, 229, 255, 0.6)' : 'rgba(170, 0, 255, 0.6)'; // Mix accents
            }
            update() {
                 // Mouse interaction
                 if (mouse.x !== null && mouse.y !== null) {
                     let dx = mouse.x - this.x;
                     let dy = mouse.y - this.y;
                     let distance = Math.sqrt(dx*dx + dy*dy);
                     let forceDirectionX = dx / distance;
                     let forceDirectionY = dy / distance;
                      // Make particles move away from mouse
                     let maxDistance = mouse.radius;
                     let force = (maxDistance - distance) / maxDistance; // Closer = stronger force
                     let directionCheck = 1; // Change to -1 to attract

                     if (distance < mouse.radius) {
                         this.x -= forceDirectionX * force * 1.5 * directionCheck; // Adjust multiplier for push strength
                         this.y -= forceDirectionY * force * 1.5 * directionCheck;
                     } else {
                         // Gradually return to normal speed/path if outside radius (optional)
                          if (this.x !== this.baseX) {
                            let dxBase = this.x - this.baseX;
                           this.x -= dxBase / 20; // Smooth return
                          }
                           if (this.y !== this.baseY) {
                               let dyBase = this.y - this.baseY;
                               this.y -= dyBase / 20;
                           }
                     }
                 } else {
                     // Normal movement if mouse is out
                    this.x += this.speedX;
                    this.y += this.speedY;
                     // Bounce off edges more smoothly
                    if (this.x < this.size || this.x > canvasWidth - this.size) this.speedX *= -1;
                    if (this.y < this.size || this.y > canvasHeight - this.size) this.speedY *= -1;
                 }

                 // Ensure particles stay within bounds slightly better
                this.x = Math.max(this.size, Math.min(this.x, canvasWidth - this.size));
                this.y = Math.max(this.size, Math.min(this.y, canvasHeight - this.size));


            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles(count) {
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
             // Connect nearby particles (optional, can be performance heavy)
             // connectParticles(particles, ctx);

            requestAnimationFrame(animateParticles);
        }

         // --- Optional: Connect nearby particles with lines ---
         function connectParticles(particleArray, context) {
            let opacityValue = 1;
            for (let a = 0; a < particleArray.length; a++) {
                for (let b = a; b < particleArray.length; b++) {
                    let dx = particleArray[a].x - particleArray[b].x;
                    let dy = particleArray[a].y - particleArray[b].y;
                    let distance = Math.sqrt(dx*dx + dy*dy);
                    let connectDistance = 100; // Max distance to connect

                    if (distance < connectDistance) {
                         opacityValue = 1 - (distance/connectDistance); // Closer = less transparent line
                        context.strokeStyle = `rgba(0, 229, 255, ${opacityValue * 0.3})`; // Cyan lines, faint
                        context.lineWidth = 0.5;
                        context.beginPath();
                        context.moveTo(particleArray[a].x, particleArray[a].y);
                        context.lineTo(particleArray[b].x, particleArray[b].y);
                        context.stroke();
                    }
                }
            }
        }

        // Initialize right after defining functions
        resizeCanvas(); // Initial size calculation and particle creation
        animateParticles(); // Start the animation loop
    }

    // --- Add any other new JS logic here ---

}); // End DOMContentLoaded
