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
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
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

    // Scroll Animation Removed



    // Number Animation with Easing
    const animateNumbers = () => {
        const stats = document.querySelectorAll('.stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const targetText = target.getAttribute('data-target');
                    if (!targetText) return;

                    const targetValue = parseFloat(targetText.replace(/,/g, '')); // Handle commas in data-target if transparent
                    const suffix = target.getAttribute('data-suffix') || '';
                    const decimals = parseInt(target.getAttribute('data-decimals')) || 0;
                    const separator = target.getAttribute('data-separator') || '';

                    // Easing animation
                    const duration = 2000; // 2 seconds
                    const startTime = performance.now();

                    const updateNumber = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // EaseOutQuart function
                        const ease = 1 - Math.pow(1 - progress, 4);

                        const currentVal = targetValue * ease;

                        let formatted = currentVal.toFixed(decimals);

                        if (separator) {
                            const parts = formatted.split('.');
                            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
                            formatted = parts.join('.');
                        }

                        target.textContent = formatted + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateNumber);
                        } else {
                            // Ensure final value is exact
                            let finalFormatted = targetValue.toFixed(decimals);
                            if (separator) {
                                const finalParts = finalFormatted.split('.');
                                finalParts[0] = finalParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
                                finalFormatted = finalParts.join('.');
                            }
                            target.textContent = finalFormatted + suffix;
                        }
                    };

                    requestAnimationFrame(updateNumber);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    };

    animateNumbers();

    // Services Solutions Tabs Functionality
    const solTabs = document.querySelectorAll('.sol-tab');
    const solPanels = document.querySelectorAll('.sol-panel');

    if (solTabs.length > 0 && solPanels.length > 0) {
        solTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.getAttribute('data-tab');

                // Remove active from all tabs and panels
                solTabs.forEach(t => t.classList.remove('active'));
                solPanels.forEach(p => p.classList.remove('active'));

                // Activate clicked tab and corresponding panel
                tab.classList.add('active');
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    // FAQ Accordion Functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (question) {
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
        }
    });
});
