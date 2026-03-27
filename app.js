// Configurações Globais GSAP
gsap.config({ nullTargetWarn: false });
gsap.registerPlugin(ScrollTrigger);

// 1. Lenis Smooth Scroll Setup
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// 2. Custom Cursor Logic
const cursor = document.querySelector('.custom-cursor');
const hoverTargets = document.querySelectorAll('.hover-target, a');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out"
    });
});

hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    target.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// 3. Lógica do Preloader
const preloader = document.querySelector('.preloader');
const counter = document.querySelector('.counter');
const preloaderLogo = document.querySelector('.preloader-logo');
let progress = 0;

const MIN_SCALE = 1;
const MAX_SCALE = 4;

// Inicializa sem tocar em x/y — a centralização fica 100% no CSS
gsap.set(preloaderLogo, { scale: MIN_SCALE, transformOrigin: "50% 50%" });

function updateCounter() {
    progress += Math.floor(Math.random() * 8) + 1;
    if (progress > 100) progress = 100;

    counter.textContent = progress + '%';

    const targetScale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * (progress / 100);

    gsap.to(preloaderLogo, {
        scale: targetScale,
        transformOrigin: "50% 50%",
        duration: 0.4,
        ease: "power1.out"
    });

    if (progress < 100) {
        setTimeout(updateCounter, Math.random() * 100 + 30);
    } else {
        gsap.to(preloaderLogo, {
            opacity: 0,
            scale: MAX_SCALE * 2.5,
            transformOrigin: "50% 50%",
            duration: 1,
            ease: "expo.inOut"
        });

        gsap.to(preloader, {
            yPercent: -100,
            duration: 1.5,
            ease: "expo.inOut",
            delay: 0.3,
            onComplete: () => initHeroAnimations()
        });
    }
}

window.addEventListener('load', () => {
    updateCounter();
});

// 4. Highlight de Texto Expertise
const expertiseText = document.querySelector('.expertise-text');
if (expertiseText) {
    const text = expertiseText.innerHTML;
    const highlightedText = text.replace(/(fluidez da edição|Adobe Premiere|color grading|precisão técnica|narrativas envolventes)/g, '<span>$1</span>');
    expertiseText.innerHTML = highlightedText;
}

// 5. Animações Hero
function initHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero .gs-reveal');
    gsap.fromTo(heroElements,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: "expo.out" }
    );
}

// 6. Revelação no Scroll
const revealElements = document.querySelectorAll('.reel .gs-reveal, .expertise .gs-reveal');
revealElements.forEach(el => {
    gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 1.5, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
        }
    );
});

// 7. Animação de Contato
const contactLinks = document.querySelectorAll('.contact-link');
gsap.fromTo(contactLinks,
    { y: 40, opacity: 0 },
    {
        y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: ".contact-integrated", start: "top 80%", toggleActions: "play none none reverse" }
    }
);

// 8. Efeito Magnético
const magneticElement = document.querySelector('.magnetic-hover');
if (magneticElement) {
    magneticElement.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = magneticElement.getBoundingClientRect();
        const x = (e.clientX - (left + width / 2)) * 0.25;
        const y = (e.clientY - (top + height / 2)) * 0.25;
        gsap.to(magneticElement, { x, y, duration: 0.6, ease: "power2.out" });
    });

    magneticElement.addEventListener('mouseleave', () => {
        gsap.to(magneticElement, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
    });
}

// 9. Dropdown de Trabalhos
function createDropdown() {
    const navbar = document.querySelector('.nav-links');
    if (!navbar) return;

    const dropdownContainer = document.createElement('div');
    dropdownContainer.style.position = 'relative';

    const button = document.createElement('a');
    button.textContent = 'Trabalhos';
    button.classList.add('hover-target');
    button.style.cursor = 'pointer';

    const dropdown = document.createElement('div');
    Object.assign(dropdown.style, {
        position: 'absolute', top: '120%', left: '0',
        background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(10px)',
        padding: '1rem', display: 'none', flexDirection: 'column',
        gap: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', minWidth: '180px'
    });

    const trabalhos = [
        { nome: 'Projeto 1', link: '#' }, { nome: 'Projeto 2', link: '#' },
        { nome: 'Projeto 3', link: '#' }, { nome: 'Projeto 4', link: '#' }
    ];

    trabalhos.forEach(item => {
        const a = document.createElement('a');
        a.href = item.link;
        a.textContent = item.nome;
        Object.assign(a.style, { color: '#f5f5f5', textDecoration: 'none', fontSize: '0.8rem', transition: 'opacity 0.3s' });
        a.addEventListener('mouseenter', () => a.style.opacity = '0.6');
        a.addEventListener('mouseleave', () => a.style.opacity = '1');
        dropdown.appendChild(a);
    });

    let isOpen = false;
    gsap.set(dropdown, { opacity: 0, y: -10, display: 'none' });

    button.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isOpen) {
            gsap.to(dropdown, { display: 'flex', opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
        } else {
            gsap.to(dropdown, { opacity: 0, y: -10, duration: 0.2, ease: "power2.in", onComplete: () => dropdown.style.display = 'none' });
        }
        isOpen = !isOpen;
    });

    document.addEventListener('click', () => {
        if (isOpen) {
            gsap.to(dropdown, { opacity: 0, y: -10, duration: 0.2, ease: "power2.in", onComplete: () => dropdown.style.display = 'none' });
            isOpen = false;
        }
    });

    dropdownContainer.appendChild(button);
    dropdownContainer.appendChild(dropdown);
    navbar.appendChild(dropdownContainer);
}

createDropdown();