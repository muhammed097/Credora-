document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle Functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMenu() {
        const isActive = mobileMenuOverlay.classList.contains('active');

        if (isActive) {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        } else {
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    if (mobileMenuToggle && mobileMenuOverlay) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', () => {
                toggleMenu();
            });
        }

        // Close mobile menu when clicking on a nav link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside the container
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) {
                toggleMenu();
            }
        });
    }

    // Active link highlighting on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Number Animation
    const animateNumbers = () => {
        const stats = document.querySelectorAll('.stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const targetText = target.getAttribute('data-target');
                    if (!targetText) return;

                    const targetValue = parseFloat(targetText);
                    const suffix = target.getAttribute('data-suffix') || '';
                    const decimals = parseInt(target.getAttribute('data-decimals')) || 0;
                    const separator = target.getAttribute('data-separator') || '';

                    const duration = 2000;
                    const steps = 60;
                    const stepTime = duration / steps;

                    let currentVal = 0;
                    const increment = targetValue / steps;

                    const timer = setInterval(() => {
                        currentVal += increment;

                        if (currentVal >= targetValue) {
                            currentVal = targetValue;
                            clearInterval(timer);
                        }

                        let formatted = currentVal.toFixed(decimals);

                        if (separator) {
                            const parts = formatted.split('.');
                            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
                            formatted = parts.join('.');
                        }

                        target.textContent = formatted + suffix;
                    }, stepTime);

                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    };

    animateNumbers();

    // FAQ Accordion Functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Animated Counter for Statistics
    function animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-target'));
        const suffix = element.getAttribute('data-suffix') || ''; // Get suffix if it exists
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        const isDecimal = target % 1 !== 0;
        const needsStars = (target === 4.3); // Add stars for 4.3


        const updateCounter = () => {
            current += increment;

            if (current < target) {
                if (isDecimal) {
                    element.textContent = current.toFixed(1);
                } else if (target >= 1000) {
                    element.textContent = Math.floor(current).toLocaleString();
                } else {
                    element.textContent = Math.floor(current);
                }
                requestAnimationFrame(updateCounter);
            } else {
                // Final value with proper formatting
                if (isDecimal) {
                    if (needsStars) {
                        element.innerHTML = target.toFixed(1) + ' <span class="star-rating">★★★★½</span> <span class="google-review-text">Google Review</span>';
                    } else {
                        element.textContent = target.toFixed(1);
                    }
                } else if (target >= 1000) {
                    element.textContent = target.toLocaleString() + suffix;
                } else {
                    element.textContent = target + suffix;
                }
            }
        };

        updateCounter();
    }

    // Intersection Observer for triggering animation
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length > 0) {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => observer.observe(stat));
    }
});
