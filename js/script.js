// Import i inicjalizacja tła Hexagonal Grid z obsługą błędów
let bg = null;
try {
    import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.16/build/backgrounds/grid1.cdn.min.js')
        .then((module) => {
            const Grid1Background = module.default;
            const canvas = document.getElementById('webgl-canvas');
            if (canvas) {
                bg = Grid1Background(canvas);
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

// Obsługa przycisku zmiany kolorów tła
const button1 = document.getElementById('colors-btn');
if (button1) {
    button1.addEventListener('click', () => {
        if (bg && bg.grid) {
            bg.grid.setColors([0xffffff * Math.random(), 0xffffff * Math.random(), 0xffffff * Math.random()]);
            bg.grid.light1.color.set(0xffffff * Math.random());
            bg.grid.light1.intensity = 500 + Math.random() * 1000;
            bg.grid.light2.color.set(0xffffff * Math.random());
            bg.grid.light2.intensity = 250 + Math.random() * 250;
        }
    });
}

// OBSŁUGA SCROLLA
window.addEventListener('load', () => {
    // MODEL 3D
    const modelViewer = document.querySelector('model-viewer');
    if (!modelViewer) {
        console.error('Element model-viewer nie istnieje');
        return;
    }
    
    const maxRotation = 720;
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    let lastScrollY = 0;
    let velocity = 0;
    let totalRotation = 0;

    // STACK ELEMENT
    const stack = document.querySelector('.stack');
    if (!stack) {
        console.error('Element .stack nie istnieje');
        return;
    }
    
    const cards = document.querySelectorAll('.stack .card');
    const processSection = document.querySelector('.process');
    if (!processSection) {
        console.error('Sekcja .process nie istnieje');
        return;
    }
    
    let isAnimating = false;
    let originalPosition = null;
    let originalStyles = {};

    // INTERSECTION OBSERVER - wykrywanie kiedy sekcja wchodzi do widoku
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isAnimating) {
                    // Sekcja w widoku - przyklejamy stack
                    startAnimation();
                } else if (!entry.isIntersecting && isAnimating) {
                    // Sekcja poza widokiem - odklejamy stack
                    stopAnimation();
                }
            });
        },
        { threshold: 0.3 }
    );

    observer.observe(processSection);

    function startAnimation() {
        if (!stack) return;
        
        // Zapisz oryginalną pozycję i style
        const rect = stack.getBoundingClientRect();
        originalPosition = {
            top: rect.top + window.scrollY,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };
        
        // Zapisz oryginalne style
        originalStyles = {
            position: stack.style.position,
            top: stack.style.top,
            left: stack.style.left,
            transform: stack.style.transform,
            width: stack.style.width,
            height: stack.style.height,
            margin: stack.style.margin,
            zIndex: stack.style.zIndex,
            opacity: stack.style.opacity,
            pointerEvents: stack.style.pointerEvents
        };
        
        // Przyklej do środka
        stack.style.position = 'fixed';
        stack.style.top = '50%';
        stack.style.left = '50%';
        stack.style.transform = 'translate(-50%, -50%)';
        stack.style.width = originalPosition.width + 'px';
        stack.style.height = originalPosition.height + 'px';
        stack.style.margin = '0';
        stack.style.zIndex = '100';
        stack.style.opacity = '1';
        stack.style.pointerEvents = 'auto';
        stack.style.transition = 'opacity 0.3s ease';
        
        isAnimating = true;
    }

    function stopAnimation() {
        if (!stack || !originalPosition || !originalStyles) return;
        
        // ZAPISZ AKTUALNĄ POZYCJĘ W DOKUMENCIE (gdzie użytkownik aktualnie scrolluje)
        const currentScrollY = window.scrollY;
        
        // Po prostu przywróć oryginalne style - element wróci na swoje miejsce w flow dokumentu
        // To jest najprostsze i najbardziej przewidywalne rozwiązanie
        Object.keys(originalStyles).forEach(key => {
            stack.style[key] = originalStyles[key];
        });
        
        // Przeskrolluj delikatnie do pozycji gdzie element powinien być
        // To zapobiegnie gwałtownym przeskokom
        setTimeout(() => {
            const elementTop = stack.offsetTop;
            const viewportHeight = window.innerHeight;
            
            // Jeśli element jest poniżej viewportu, przeskrolluj do niego płynnie
            if (elementTop > currentScrollY + viewportHeight) {
                window.scrollTo({
                    top: elementTop - viewportHeight / 3,
                    behavior: 'smooth'
                });
            }
        }, 100);
        
        isAnimating = false;
    }

    const handleModelScroll = () => {
        const scrollY = window.scrollY;
        const scrollProgress = Math.min(scrollY / scrollHeight, 1);
        
        velocity = scrollY - lastScrollY;
        lastScrollY = scrollY;

        totalRotation += Math.abs(velocity) * 0.2;

        if (scrollProgress <= 0.05) {
            modelViewer.cameraOrbit = `${-totalRotation}deg 90deg ${Math.sin(scrollProgress * Math.PI * 4) * 15}deg`;
            modelViewer.style.opacity = 1;
            
            const scale = 1 - (scrollProgress * 0.8);
            const yPos = 50 + (scrollProgress * 90);
            
            modelViewer.style.transform = `translate(-50%, -${yPos}%) scale(${scale})`;
            modelViewer.style.filter = `drop-shadow(0 0 ${20 - (scrollProgress * 18)}px rgba(255, 255, 255, ${1 - (scrollProgress * 0.8)}))`;
        } else {
            modelViewer.style.transform = `translate(-50%, -140%) scale(0.2)`;
            modelViewer.style.opacity = 1;
            modelViewer.style.filter = `drop-shadow(0 0 2px rgba(255, 255, 255, 0.2))`;
        }
    };

    const handleStackScroll = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Pobierz pozycję sekcji process względem dokumentu
        const sectionRect = processSection.getBoundingClientRect();
        const sectionTop = scrollY + sectionRect.top;
        const sectionHeight = sectionRect.height;
        
        // Oblicz progres względem pozycji sekcji process
        let progress = (scrollY - sectionTop + windowHeight) / (sectionHeight + windowHeight);
        progress = Math.max(0, Math.min(1, progress));
        
        stack.style.setProperty('--scroll-progress', progress);
        cards.forEach(card => {
            card.style.setProperty('--scroll-progress', progress);
        });

        // Płynne zanikanie elementu gdy jest poniżej sekcji
        if (scrollY > sectionTop + sectionHeight) {
            // Oblicz jak daleko poniżej sekcji jest użytkownik
            const distanceBelow = scrollY - (sectionTop + sectionHeight);
            const fadeDistance = windowHeight * 0.5; // Odległość w której ma nastąpić zanikanie
            const opacity = Math.max(0, 1 - (distanceBelow / fadeDistance));
            
            stack.style.opacity = opacity;
            stack.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
        } else {
            stack.style.opacity = '1';
            stack.style.pointerEvents = 'auto';
        }
    };

    const handleScroll = () => {
        handleModelScroll();
        handleStackScroll();
    };

    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll);
    handleScroll();
});
