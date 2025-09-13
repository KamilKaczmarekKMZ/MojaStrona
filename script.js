// Import i inicjalizacja tła Hexagonal Grid z obsługą błędów
try {
    import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.16/build/backgrounds/grid1.cdn.min.js')
        .then((module) => {
            const Grid1Background = module.default;
            const canvas = document.getElementById('webgl-canvas');
            if (canvas) {
                const bg = Grid1Background(canvas);
                // DOPASOWANE KOLORY POCZĄTKOWE - ZIEMISTA PALETA
                bg.grid.setColors([0xC9AD92, 0x473523, 0xD8C4B0]);
                bg.grid.light1.color.set(0xF5F5DC);
                bg.grid.light1.intensity = 650;
                bg.grid.light2.color.set(0x8B4513);
                bg.grid.light2.intensity = 350;
            }
        })
        .catch((error) => {
            console.error('Błąd podczas ładowania tła:', error);
        });
} catch (error) {
    console.error('Błąd podczas importowania modułu:', error);
}

// Funkcja do generowania randomowego linku (dla pozostałych przycisków)
function getRandomLink() {
    const randomLinks = [
        'https://example.com/page1',
        'https://example.com/page2',
        'https://example.com/page3',
        'https://example.com/page4',
        'https://example.com/page5'
    ];
    return randomLinks[Math.floor(Math.random() * randomLinks.length)];
}

// Funkcja do płynnego przewijania do elementu
function smoothScrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Zmienne globalne
let scrollTimeout;
let cursorTimeout;

// Ładowanie strony
window.addEventListener('load', function() {
    document.querySelector('.loader').classList.add('hidden');
    
    // Animacja sekcji hero po załadowaniu strony
    document.querySelector('.hero h1').style.animation = 'fadeInUp 1s forwards 0.3s';
    document.querySelector('.hero p').style.animation = 'fadeInUp 1s forwards 0.6s';
    document.querySelector('.hero-buttons').style.animation = 'fadeInUp 1s forwards 0.9s';
    document.querySelector('.scroll-indicator').style.animation = 'fadeInUp 1s forwards 1.2s';
});

// Obsługa scrollowania nagłówka
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 100);
});

// Obsługa animacji podczas scrollowania
const projects = document.querySelectorAll('.project');
const options = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.unobserve(entry.target);
        }
    });
}, options);

projects.forEach(project => {
    project.style.opacity = '0';
    project.style.transform = 'translateY(50px)';
    observer.observe(project);
});

// Płynne przewijanie do sekcji
document.querySelector('.scroll-indicator').addEventListener('click', function() {
    document.querySelector('.projects').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', function(e) {
    cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    
    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(function() {
        cursorFollower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }, 50);
});

// Zmiana kursora przy najeżdżaniu na linki i przyciski
const hoverElements = document.querySelectorAll('a, button, .project-link, .contact-button, .social-link');

hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.2)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// OBSŁUGA PRZYCISKÓW
document.addEventListener('DOMContentLoaded', function() {
    // Przycisk "Let's begin" - randomowy link
    const letsBeginBtn = document.getElementById('letsBeginBtn');
    if (letsBeginBtn) {
        letsBeginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = getRandomLink();
        });
    }

    // Przycisk "Learn more" - przewijanie do sekcji Knowledge
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScrollToElement('knowledgeSection');
        });
    }

    // SPECJALNA OBSŁUGA DLA PRZYCISKU "View project" pod "How automation can help you grow"
    const projectLink1 = document.getElementById('projectLink1');
    if (projectLink1) {
        projectLink1.addEventListener('click', function(e) {
            e.preventDefault();
            // TYLKO TEN PRZYCISK PRZEKIEROWUJE NA TEN SPECJALNY LINK
            window.location.href = 'https://kamilkaczmarekkmz.github.io/MojaStrona/Why.html';
        });
    }

    // Pozostałe przyciski "View project" w sekcji Knowledge (losowe linki)
    const projectLink2 = document.getElementById('projectLink2');
    if (projectLink2) {
        projectLink2.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = getRandomLink();
        });
    }

    const projectLink3 = document.getElementById('projectLink3');
    if (projectLink3) {
        projectLink3.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = getRandomLink();
        });
    }

    // Przycisk "Contact us" na dole strony - randomowy link
    const contactBtn = document.getElementById('contactBtn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = getRandomLink();
        });
    }
});

// Fallback dla modelu 3D - jeśli nie załaduje się w ciągu 5 sekund
setTimeout(() => {
    const modelViewer = document.querySelector('model-viewer');
    const poster = document.querySelector('.model-placeholder');
    if (modelViewer && poster && !modelViewer.loaded) {
        poster.style.display = 'flex';
    }
}, 5000);
