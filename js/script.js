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
    
    const processSection = document.querySelector('.process');
    if (!processSection) {
        console.error('Sekcja .process nie istnieje');
        return;
    }
    
    let isAnimating = false;
    let animationCompleted = false;
    let originalStyles = {};
    let lastAnimationTime = 0;
    const ANIMATION_THROTTLE = 16; // ~60fps

    // INTERSECTION OBSERVER - wykrywanie kiedy sekcja wchodzi do widoku
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isAnimating && !animationCompleted) {
                    // Sekcja w widoku - płynne pojawianie i przyklejanie stack
                    startSmoothAnimation();
                }
            });
        },
        { threshold: 0.3 }
    );

    observer.observe(processSection);

    // Obsługa zmiany rozmiaru okna
    window.addEventListener('resize', handleWindowResize);

    function handleWindowResize() {
        if (isAnimating || animationCompleted) {
            repositionFixedStack();
        }
    }

    function repositionFixedStack() {
        if (stack.style.position === 'fixed') {
            stack.style.left = '50%';
            stack.style.top = '50%';
            stack.style.transform = 'translate(-50%, -50%)';
        }
    }

    function startSmoothAnimation() {
        if (!stack || animationCompleted) return;
        
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
        
        // Ustaw początkowy styl - pojawianie się
        stack.style.opacity = '0';
        stack.style.pointerEvents = 'none';
        
        // Poczekaj chwilę i płynnie pojaw oraz przyklej do środka
        setTimeout(() => {
            stack.style.opacity = '1';
            stack.style.position = 'fixed';
            stack.style.top = '50%';
            stack.style.left = '50%';
            stack.style.transform = 'translate(-50%, -50%)';
            stack.style.width = 'auto';
            stack.style.height = 'auto';
            stack.style.margin = '0';
            stack.style.zIndex = '1000'; // Wyższy niż inne elementy
            stack.style.pointerEvents = 'auto';
            
            isAnimating = true;
            animationCompleted = false;
        }, 100);
    }

    function resetStackStyles() {
        if (!stack) return;
        
        // Przywróć oryginalne style
        Object.keys(originalStyles).forEach(property => {
            stack.style[property] = originalStyles[property];
        });
        
        stack.style.removeProperty('--scroll-progress');
        stack.style.removeProperty('display');
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
        if (!stack || !processSection) return;
        
        const currentTime = Date.now();
        if (currentTime - lastAnimationTime < ANIMATION_THROTTLE) {
            return; // Throttle animacji
        }
        lastAnimationTime = currentTime;
        
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Pobierz pozycję sekcji process względem dokumentu
        const sectionRect = processSection.getBoundingClientRect();
        const sectionTop = scrollY + sectionRect.top;
        const sectionHeight = sectionRect.height;
        const sectionBottom = sectionTop + sectionHeight;
        
        // Oblicz progres animacji (0-1)
        let animationProgress = 0;
        
        if (scrollY >= sectionTop && scrollY <= sectionBottom) {
            // Podczas przechodzenia przez sekcję - animacja od 0 do 1
            animationProgress = (scrollY - sectionTop) / sectionHeight;
        } else if (scrollY > sectionBottom) {
            // Po sekcji - animacja zakończona (1)
            animationProgress = 1;
        }
        
        animationProgress = Math.max(0, Math.min(1, animationProgress));
        
        // Ustaw zmienną CSS tylko na stack (karty odziedziczą)
        stack.style.setProperty('--scroll-progress', animationProgress);

        // Zakończ animację i rozpocznij zanikanie po osiągnięciu 95%
        if (animationProgress >= 0.95 && isAnimating && !animationCompleted) {
            animationCompleted = true;
            isAnimating = false;
        }
        
        // Płynne zanikanie elementu po zakończeniu animacji
        if (animationCompleted) {
            const distancePastSection = Math.max(0, scrollY - sectionBottom);
            const fadeDistance = windowHeight * 0.8;
            const opacity = Math.max(0, 1 - (distancePastSection / fadeDistance));
            
            stack.style.opacity = opacity;
            stack.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
            
            // Całkowite ukrycie i reset po pełnym zaniknięciu
            if (opacity <= 0) {
                stack.style.display = 'none';
                resetStackStyles();
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
    
    // Inicjalne wywołanie
    handleScroll();
});
