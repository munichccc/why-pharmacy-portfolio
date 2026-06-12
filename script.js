document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const coverScreen = document.getElementById('coverScreen');
    const contentScreen = document.getElementById('contentScreen');
    const btnEnter = document.getElementById('btnEnter');
    const btnBack = document.getElementById('btnBack');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentArea = document.querySelector('.content-area');
    const sections = document.querySelectorAll('.content-card');

    // 1. Navigation Transition: Cover -> Content
    btnEnter.addEventListener('click', () => {
        // Add fade-out classes
        coverScreen.style.opacity = '0';
        coverScreen.style.transform = 'translateY(-30px)';
        
        setTimeout(() => {
            coverScreen.classList.add('hidden');
            contentScreen.classList.remove('hidden');
            
            // Force reflow and animate in
            setTimeout(() => {
                contentScreen.style.opacity = '1';
                contentScreen.style.transform = 'translateY(0)';
                
                // Initialize scroll animations once screen is loaded
                triggerScrollReveal();
            }, 50);
        }, 600); // Matches transition-slow duration
    });

    // 2. Navigation Transition: Content -> Cover
    btnBack.addEventListener('click', () => {
        contentScreen.style.opacity = '0';
        contentScreen.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            contentScreen.classList.add('hidden');
            coverScreen.classList.remove('hidden');
            
            setTimeout(() => {
                coverScreen.style.opacity = '1';
                coverScreen.style.transform = 'translateY(0)';
            }, 50);
        }, 600);
    });

    // 3. Smooth scrolling for sidebar links within the custom scroll container
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Remove active from all
                navLinks.forEach(l => l.classList.remove('active'));
                // Add to clicked
                link.classList.add('active');
                
                // Smooth scroll specifically inside the .content-area
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 4. Scroll Reveal & Active Link Synchronization
    // We use IntersectionObserver to detect cards in viewport for active nav highlight
    const observerOptions = {
        root: contentArea, // The scrollable container
        rootMargin: '-20% 0px -60% 0px', // Trigger when card occupies middle-upper part of viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                // Update active navigation link
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    // Observe each card
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 5. General Scroll Reveal for fading-in elements on scroll
    function triggerScrollReveal() {
        const revealElements = document.querySelectorAll('.animate-scroll-reveal');
        
        const revealObserverOptions = {
            root: contentArea,
            rootMargin: '0px 0px -10% 0px', // Trigger slightly before element enters view
            threshold: 0.15
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Once visible, we can stop observing it
                    revealObserver.unobserve(entry.target);
                }
            });
        }, revealObserverOptions);

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // 6. Interactive Lightbox Modal Gallery
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryImages = Array.from(galleryItems).map(item => item.querySelector('img'));
    let currentImgIndex = 0;

    function openLightbox(index) {
        currentImgIndex = index;
        const img = galleryImages[index];
        if (img) {
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt || "ผลงานและเกียรติบัตร";
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scrolling
    }

    function showNextImage() {
        currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
        openLightbox(currentImgIndex);
    }

    function showPrevImage() {
        currentImgIndex = (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(currentImgIndex);
    }

    // Event Listeners for click on items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    // Close button
    lightboxClose.addEventListener('click', closeLightbox);

    // Prev/Next buttons
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });

    // Backdrop click to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
            closeLightbox();
        }
    });

    // Keyboard navigation controls
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    });
});
