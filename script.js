// Premium Portfolio Interaction Script

document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile Navigation Toggle
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Icon Toggle
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Header Scroll Effect (Glassmorphism enhancer)
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Hover effect for Resume Button (Feedback)
    const resumeBtn = document.querySelector('a[download]');
    if (resumeBtn) {
        resumeBtn.addEventListener('mouseenter', () => {
            const icon = resumeBtn.querySelector('i');
            if(icon) icon.classList.add('fa-bounce');
        });
        resumeBtn.addEventListener('mouseleave', () => {
            const icon = resumeBtn.querySelector('i');
            if(icon) icon.classList.remove('fa-bounce');
        });
    }
});
