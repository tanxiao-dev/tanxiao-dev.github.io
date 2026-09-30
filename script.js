const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('.primary-nav');
const navLinks = [...document.querySelectorAll('.primary-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const revealElements = document.querySelectorAll('.reveal');
const yearElement = document.querySelector('#current-year');
const mobileNavQuery = window.matchMedia('(max-width: 760px)');

const setMenuState = (isOpen) => {
    if (!navToggle || !primaryNav) return;

    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    primaryNav.classList.toggle('open', isOpen);
    document.body.classList.toggle('nav-open', isOpen && mobileNavQuery.matches);

    if (mobileNavQuery.matches) {
        primaryNav.setAttribute('aria-hidden', String(!isOpen));
    } else {
        primaryNav.removeAttribute('aria-hidden');
    }
};

const closeMenu = () => setMenuState(false);

if (navToggle && primaryNav) {
    setMenuState(false);

    navToggle.addEventListener('click', () => {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        setMenuState(!isOpen);
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMenu));

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
            closeMenu();
            navToggle.focus();
        }
    });

    const syncMenuForViewport = () => closeMenu();
    mobileNavQuery.addEventListener?.('change', syncMenuForViewport);
    window.addEventListener('resize', syncMenuForViewport);
}

const updateNavigation = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    if (!sections.length || !navLinks.length) return;

    const currentSection = [...sections].reverse().find((section) => window.scrollY >= section.offsetTop - 180) || sections[0];
    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSection.id}`);
    });
};

window.addEventListener('scroll', updateNavigation, { passive: true });
updateNavigation();

if ('IntersectionObserver' in window && revealElements.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add('visible'));
}

if (yearElement) yearElement.textContent = new Date().getFullYear();
