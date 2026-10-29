/**
 * Portfolio JavaScript - Sean Andrie Cubio
 * Interactivity: Navigation, Filtering, Smooth Scrolling, & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Sticky & Scroll State
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        highlightActiveNavLink();
    });

    // 2. Mobile Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const icon = navToggle.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('open')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close mobile menu when clicking any nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 3. Back to Top Scroll
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. Active Nav Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    function highlightActiveNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const navItem = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

            if (navItem) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navItem.classList.add('active');
                } else {
                    navItem.classList.remove('active');
                }
            }
        });
    }

    // 5. Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state on buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });



    // 7. Dynamic Animated Number Counters for Stats
    const statCounters = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function startCounters() {
        if (countersStarted) return;
        statCounters.forEach(counter => {
            const attr = counter.getAttribute('data-target');
            if (!attr) return;
            const target = parseInt(attr);
            if (isNaN(target)) return;

            let count = 0;
            const speed = 2000 / target;

            const updateCount = () => {
                const inc = Math.ceil(target / 40);
                if (count < target) {
                    count += inc;
                    if (count > target) count = target;
                    counter.innerText = count + (target === 100 ? '%' : '+');
                    setTimeout(updateCount, 40);
                } else {
                    counter.innerText = target + (target === 100 ? '%' : '+');
                }
            };
            updateCount();
        });
        countersStarted = true;
    }

    // Trigger counters when stats section is in view
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounters();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsBar);
    }

    // 8. Quick View Resume Modal
    const resumeModal = document.getElementById('resumeModal');
    const resumeImageContainer = document.getElementById('resumeImageContainer');
    const resumeZoomLevel = document.getElementById('resumeZoomLevel');
    const zoomInBtn = document.getElementById('resumeZoomIn');
    const zoomOutBtn = document.getElementById('resumeZoomOut');
    const zoomResetBtn = document.getElementById('resumeZoomReset');
    const printResumeBtn = document.getElementById('printResumeBtn');

    // Zoom scale steps (in pixels max-width)
    const zoomSteps = [450, 560, 700, 850, 1050, 1300];
    let currentZoomIndex = 2; // Default index 2 = 700px (100%)

    function updateZoomDisplay() {
        if (!resumeImageContainer) return;
        const width = zoomSteps[currentZoomIndex];
        resumeImageContainer.style.maxWidth = width + 'px';
        
        if (resumeZoomLevel) {
            const pct = Math.round((width / 700) * 100);
            resumeZoomLevel.textContent = pct + '%';
        }
    }

    function openResumeModal() {
        if (!resumeModal) return;
        currentZoomIndex = 2; // Reset to 100% on open
        updateZoomDisplay();
        resumeModal.classList.add('active');
        resumeModal.style.setProperty('display', 'flex', 'important');
        document.body.classList.add('resume-modal-open');
    }

    function closeResumeModal() {
        if (!resumeModal) return;
        resumeModal.classList.remove('active');
        resumeModal.style.setProperty('display', 'none', 'important');
        document.body.classList.remove('resume-modal-open');
    }

    // Expose closeResumeModalFunction and openResumeModal globally
    window.closeResumeModalFunction = closeResumeModal;
    window.openResumeModal = openResumeModal;
    window.resetResumeZoom = function() {
        currentZoomIndex = 2;
        updateZoomDisplay();
    };

    // Delegated click handler for opening and closing modal
    document.addEventListener('click', (e) => {
        // Open trigger
        const trigger = e.target.closest('.resume-open-trigger, [id*="ResumeBtn"], [id*="resumeBtn"]');
        if (trigger) {
            e.preventDefault();
            openResumeModal();
            return;
        }

        // Close triggers (X button, backdrop, close buttons)
        if (e.target.closest('#closeResumeModal') || e.target.closest('.modal-close-btn') || e.target.id === 'resumeModalBackdrop') {
            e.preventDefault();
            closeResumeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const loginModal = document.getElementById('loginModal');
            const demoModal = document.getElementById('demoModal');
            if (loginModal && loginModal.classList.contains('active') && typeof closeLoginModal === 'function') {
                closeLoginModal();
            } else if (demoModal && demoModal.classList.contains('active') && typeof closeDemoModal === 'function') {
                closeDemoModal();
            } else if (resumeModal && resumeModal.classList.contains('active')) {
                closeResumeModal();
            }
        }
    });

    // Zoom controls
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentZoomIndex < zoomSteps.length - 1) {
                currentZoomIndex++;
                updateZoomDisplay();
            }
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentZoomIndex > 0) {
                currentZoomIndex--;
                updateZoomDisplay();
            }
        });
    }

    if (zoomResetBtn) {
        zoomResetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentZoomIndex = 2; // 700px = 100%
            updateZoomDisplay();
        });
    }

    // Print Handler
    if (printResumeBtn) {
        printResumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.print();
        });
    }

    // ==============================================================
    // 9. Mock Interview Video Player Interactivity
    // ==============================================================
    const interviewVideo = document.getElementById('interviewVideo');
    const videoPlayOverlay = document.getElementById('videoPlayOverlay');
    const playBtnIcon = document.getElementById('playBtnIcon');
    const playBtnText = document.getElementById('playBtnText');
    const muteBtnIcon = document.getElementById('muteBtnIcon');
    const videoTimer = document.getElementById('videoTimer');
    const speedText = document.getElementById('speedText');
    const chapterItems = document.querySelectorAll('.chapter-item');

    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    function toggleInterviewVideoPlay() {
        if (!interviewVideo) return;
        if (interviewVideo.paused || interviewVideo.ended) {
            interviewVideo.play().then(() => {
                if (videoPlayOverlay) videoPlayOverlay.classList.add('playing');
                if (playBtnIcon) {
                    playBtnIcon.classList.remove('fa-play');
                    playBtnIcon.classList.add('fa-pause');
                }
                if (playBtnText) playBtnText.textContent = 'Pause';
            }).catch(() => {});
        } else {
            interviewVideo.pause();
            if (videoPlayOverlay) videoPlayOverlay.classList.remove('playing');
            if (playBtnIcon) {
                playBtnIcon.classList.remove('fa-pause');
                playBtnIcon.classList.add('fa-play');
            }
            if (playBtnText) playBtnText.textContent = 'Play';
        }
    }

    function toggleInterviewVideoMute() {
        if (!interviewVideo) return;
        interviewVideo.muted = !interviewVideo.muted;
        if (muteBtnIcon) {
            if (interviewVideo.muted) {
                muteBtnIcon.classList.remove('fa-volume-up');
                muteBtnIcon.classList.add('fa-volume-mute');
            } else {
                muteBtnIcon.classList.remove('fa-volume-mute');
                muteBtnIcon.classList.add('fa-volume-up');
            }
        }
    }

    const speeds = [1.0, 1.25, 1.5, 2.0];
    let currentSpeedIndex = 0;
    function cycleVideoSpeed() {
        if (!interviewVideo) return;
        currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
        const newSpeed = speeds[currentSpeedIndex];
        interviewVideo.playbackRate = newSpeed;
        if (speedText) speedText.textContent = newSpeed + 'x';
    }

    function toggleInterviewFullscreen() {
        if (!interviewVideo) return;
        if (interviewVideo.requestFullscreen) {
            interviewVideo.requestFullscreen();
        } else if (interviewVideo.webkitRequestFullscreen) {
            interviewVideo.webkitRequestFullscreen();
        } else if (interviewVideo.msRequestFullscreen) {
            interviewVideo.msRequestFullscreen();
        }
    }

    function seekInterviewVideo(seconds) {
        if (!interviewVideo) return;
        interviewVideo.currentTime = seconds;
        interviewVideo.play().catch(() => {});
        if (videoPlayOverlay) videoPlayOverlay.classList.add('playing');
        if (playBtnIcon) {
            playBtnIcon.classList.remove('fa-play');
            playBtnIcon.classList.add('fa-pause');
        }
        if (playBtnText) playBtnText.textContent = 'Pause';
        highlightActiveChapter(seconds);
    }

    function highlightActiveChapter(currentTime) {
        let activeIdx = -1;
        chapterItems.forEach((item, index) => {
            const time = parseFloat(item.getAttribute('data-time') || 0);
            if (currentTime >= time) {
                activeIdx = index;
            }
        });
        chapterItems.forEach((item, index) => {
            if (index === activeIdx) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    if (interviewVideo) {
        interviewVideo.addEventListener('play', () => {
            if (videoPlayOverlay) videoPlayOverlay.classList.add('playing');
            if (playBtnIcon) {
                playBtnIcon.classList.remove('fa-play');
                playBtnIcon.classList.add('fa-pause');
            }
            if (playBtnText) playBtnText.textContent = 'Pause';
        });

        interviewVideo.addEventListener('pause', () => {
            if (videoPlayOverlay) videoPlayOverlay.classList.remove('playing');
            if (playBtnIcon) {
                playBtnIcon.classList.remove('fa-pause');
                playBtnIcon.classList.add('fa-play');
            }
            if (playBtnText) playBtnText.textContent = 'Play';
        });

        interviewVideo.addEventListener('timeupdate', () => {
            if (videoTimer) {
                videoTimer.textContent = formatTime(interviewVideo.currentTime) + ' / ' + formatTime(interviewVideo.duration);
            }
            highlightActiveChapter(interviewVideo.currentTime);
        });

        interviewVideo.addEventListener('loadedmetadata', () => {
            if (videoTimer) {
                videoTimer.textContent = '00:00 / ' + formatTime(interviewVideo.duration);
            }
        });
    }

    // Expose video control functions globally
    window.toggleInterviewVideoPlay = toggleInterviewVideoPlay;
    window.toggleInterviewVideoMute = toggleInterviewVideoMute;
    window.cycleVideoSpeed = cycleVideoSpeed;
    window.toggleInterviewFullscreen = toggleInterviewFullscreen;
    window.seekInterviewVideo = seekInterviewVideo;
});
