// Initialize Lenis for Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


// Custom Cursor Logic
const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows immediately
    dot.style.left = `${posX}px`;
    dot.style.top = `${posY}px`;

    // Outline follows with lag (handled nicely by CSS transition or GSAP for smoother feel)
    // Let's use GSAP for the outline for smoother lag
    gsap.to(outline, {
        x: posX,
        y: posY,
        duration: 0.5, // The lag duration
        ease: "power2.out"
    });
});

// Cursor Interactions
const linkItems = document.querySelectorAll('a, button, .product-card');
linkItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        gsap.to(outline, { scale: 2, backgroundColor: 'rgba(206, 255, 0, 0.1)', duration: 0.2 });
    });
    item.addEventListener('mouseleave', () => {
        gsap.to(outline, { scale: 1, backgroundColor: 'transparent', duration: 0.2 });
    });
});


// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Hero Animation
const tl = gsap.timeline();

tl.from(".logo, .menu a, .cart-icon", {
    y: -50,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power4.out"
})
.from("h1", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
    clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" // Reveal effect
}, "-=0.5")
.from(".hero-content p, .cta-btn", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2
}, "-=0.8");

// Scroll Animations for Product Cards
gsap.from(".product-card", {
    scrollTrigger: {
        trigger: ".product-grid",
        start: "top 80%", // Start when top of grid is 80% down viewport
        toggleActions: "play none none reverse"
    },
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
});

// Parallax Effect for Feature Image
gsap.to(".feature-img-container img", {
    scrollTrigger: {
        trigger: ".features",
        start: "top bottom",
        end: "bottom top",
        scrub: true
    },
    y: -50, // Move image slightly up as we scroll down
    scale: 1.1,
    ease: "none"
});

// Feature Text Reveal
gsap.from(".feature-text", {
    scrollTrigger: {
        trigger: ".features",
        start: "top 70%",
    },
    x: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
});
