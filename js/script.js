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
    let lastScrollDirection = 'down'; // Śledzenie kierunku scrolla

    // INTERSECTION OBSERVER - TYLKO START ANIMACJI
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isAnimating) {
                    // Sekcja w widoku - przyklejamy stack
                    startAnimation();
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
            pointerEvents: stack.style.pointerEvents,
            transition: stack.style.transition
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
        stack.style.transition = 'opacity 0.3s ease, transform 0.3s ease'; // SZYBSZE przejścia (0.3s)
        
        isAnimating = true;
    }

    function reverseAnimation() {
        if (!stack || !isAnimating) return;
        
        // SZYBSZE ODWROTNE ZANIKANIE (0.3s)
        stack.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        stack.style.opacity = '0';
        stack.style.pointerEvents = 'none';
        stack.style.transform = 'translate(-50%, -50%) scale(0.9)'; // Delikatne zmniejszenie
        
        // Po zakończeniu animacji, przywróć oryginalne style
        setTimeout(() => {
            if (!stack || !originalStyles) return;
            
            Object.keys(originalStyles).forEach(key => {
                stack.style[key] = originalStyles[key];
            });
            
            isAnimating = false;
        }, 300); // SZYBSZE - czas trwania odwrotnej animacji (300ms)
    }

    const handleModelScroll = () => {
        const scrollY = window.scrollY;
        const scrollProgress = Math.min(scrollY / scrollHeight, 1);
        
        // Śledzenie kierunku scrolla
        const currentScrollDirection = scrollY > lastScrollY ? 'down' : 'up';
        lastScrollDirection = currentScrollDirection;
        
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
        const sectionBottom = sectionTop + sectionHeight;
        
        // Oblicz progres względem pozycji sekcji process
        let progress = (scrollY - sectionTop + windowHeight) / (sectionHeight + windowHeight);
        progress = Math.max(0, Math.min(1, progress));
        
        stack.style.setProperty('--scroll-progress', progress);
        cards.forEach(card => {
            card.style.setProperty('--scroll-progress', progress);
        });

        if (isAnimating) {
            // SZYBSZE ZANIKANIE - mniejsza odległość dla szybszej reakcji
            const distanceFromSection = Math.abs(scrollY - (sectionTop - windowHeight * 0.3));
            const maxFadeDistance = windowHeight * 1.5; // MNIEJ: 1.5x wysokość okna dla SZYBSZEGO zanikania
            
            let opacity = 1;
            
            if (scrollY > sectionBottom) {
                // Poniżej sekcji - SZYBSZE zanikanie
                const distanceBelow = scrollY - sectionBottom;
                opacity = Math.max(0, 1 - (distanceBelow / maxFadeDistance));
            } else if (scrollY < sectionTop - windowHeight * 0.3) {
                // Powyżej sekcji - SZYBSZE pojawianie się przy scrollu w dół
                const distanceAbove = (sectionTop - windowHeight * 0.3) - scrollY;
                opacity = Math.max(0, 1 - (distanceAbove / maxFadeDistance));
            }
            
            // SZYBSZA zmiana opacity z animacją
            stack.style.transition = 'opacity 0.2s ease'; // SZYBCIEJ (0.2s)
            stack.style.opacity = opacity.toString();
            stack.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
            
            // SZYBSZE reakcje - mniejsze odległości dla triggerowania
            if (lastScrollDirection === 'up' && scrollY < sectionTop - windowHeight * 0.6) {
                reverseAnimation(); // SZYBCIEJ przy scrollu w górę
            }
            
            if (lastScrollDirection === 'down' && scrollY > sectionBottom + windowHeight * 1.8) {
                reverseAnimation(); // SZYBCIEJ przy scrollu w dół
            }
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
