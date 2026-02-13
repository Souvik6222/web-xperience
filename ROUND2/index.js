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

// Custom Cursor
const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    dot.style.left = `${posX}px`;
    dot.style.top = `${posY}px`;

    // Smooth follow for outline
    gsap.to(outline, {
        x: posX,
        y: posY,
        duration: 0.5,
        ease: "power2.out"
    });
});

// Cursor Interactions
const interactables = document.querySelectorAll('a, button, .product-card, input');
interactables.forEach(item => {
    item.addEventListener('mouseenter', () => {
        gsap.to(outline, { scale: 1.5, borderColor: 'transparent', backgroundColor: 'rgba(206, 255, 0, 0.4)', duration: 0.2 });
    });
    item.addEventListener('mouseleave', () => {
        gsap.to(outline, { scale: 1, borderColor: '#CEFF00', backgroundColor: 'transparent', duration: 0.2 });
    });
});


// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// 1. Hero Reveal
const tl = gsap.timeline();
tl.from("nav", { y: -100, opacity: 0, duration: 1, ease: "power4.out" })
    .from(".hero-text-wrapper h1", { y: 150, opacity: 0, duration: 1.5, skewY: 5, ease: "power4.out" }, "-=0.5")
    .from(".hero-content p", { y: 20, opacity: 0, duration: 1 }, "-=1")
    .from(".hero-btns button", { y: 20, opacity: 0, stagger: 0.2, duration: 0.8 }, "-=0.8");

// 2. Parallax Hero Background on Scroll
gsap.to(".hero-bg", {
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    },
    y: 200, // Move bg down slower than scroll
    scale: 1.2 // Slight zoom in
});

// 3. Manifesto Text Highlight
// Split text by words for reveal (simple version without library)
const manifestoText = document.querySelector('.manifesto-text');
// We animate opacity of the non-highlighted text to create focus
gsap.from(".manifesto-text", {
    scrollTrigger: {
        trigger: ".manifesto",
        start: "top 80%",
        end: "bottom 60%",
        scrub: 1
    },
    opacity: 0.2,
    y: 50
});
gsap.to(".manifesto .highlight", {
    scrollTrigger: {
        trigger: ".manifesto",
        start: "top 70%",
        end: "top 40%",
        scrub: true
    },
    color: "#CEFF00",
    textShadow: "0 0 10px #CEFF00"
});

// 4. Section Headers & Lines
document.querySelectorAll('.section-header').forEach(header => {
    gsap.from(header.querySelector('h2'), {
        scrollTrigger: { trigger: header, start: "top 85%" },
        y: 50, opacity: 0, duration: 0.8
    });
    // Animate the line width
    gsap.to(header.querySelector('.line'), {
        scrollTrigger: { trigger: header, start: "top 85%" },
        width: "100%", // CSS handles width, we trigger class or just animate pseudo via CSS logic helper
        onStart: () => { header.querySelector('.line').classList.add('animate'); } // Simplified logic
    });
});

// 5. Product Cards Stagger
document.querySelectorAll('.product-grid').forEach(grid => {
    gsap.from(grid.querySelectorAll('.product-card'), {
        scrollTrigger: {
            trigger: grid,
            start: "top 80%"
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
    });
});

// 6. Video Parallax
gsap.to(".bg-video", {
    scrollTrigger: {
        trigger: ".video-parallax",
        start: "top bottom",
        end: "bottom top",
        scrub: true
    },
    y: -100
});

// 7. Features Parallax
gsap.to(".feature-img-container img", {
    scrollTrigger: {
        trigger: ".features",
        start: "top bottom",
        end: "bottom top",
        scrub: true
    },
    y: -50,
    scale: 1.1
});

// Feature Text Reveal
gsap.from(".feature-text > *", {
    scrollTrigger: {
        trigger: ".features",
        start: "top 70%",
    },
    x: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power2.out"
});


// ------------------------------------------------
// YOUTUBE API INTEGRATION
// ------------------------------------------------
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: '27qfOLy3ETg', // Updated Video ID
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'showinfo': 0,
            'modestbranding': 1,
            'loop': 1,
            'fs': 0,
            'cc_load_policy': 0,
            'iv_load_policy': 3,
            'autohide': 0,
            'playlist': '27qfOLy3ETg', // Required for loop
            'mute': 1 // Must be muted to autoplay
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
    event.target.mute(); // Ensure muted start
}

// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


// Mute/Unmute Interaction
const videoSection = document.querySelector('.video-parallax');
const overlayText = document.querySelector('.video-overlay p');

videoSection.addEventListener('mouseenter', () => {
    if (player && player.unMute) {
        player.unMute();
        // feedback
        if (overlayText) overlayText.textContent = "Sound On";
        gsap.to(videoSection, { border: "2px solid #CEFF00", duration: 0.3 });
    }
});

videoSection.addEventListener('mouseleave', () => {
    if (player && player.mute) {
        player.mute();
        // feedback
        if (overlayText) overlayText.textContent = "Hover to Unmute";
        gsap.to(videoSection, { border: "none", duration: 0.3 });
    }
});
