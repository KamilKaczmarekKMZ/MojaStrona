// Import i inicjalizacja tła Hexagonal Grid
try {
    import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.16/build/backgrounds/grid1.cdn.min.js')
        .then((module) => {
            const Grid1Background = module.default;
            const canvas = document.getElementById('webgl-canvas');
            const bg = Grid1Background(canvas);
            bg.grid.setColors([0xC9AD92, 0x473523, 0xD8C4B0]);
            bg.grid.light1.color.set(0xF5F5DC);
            bg.grid.light1.intensity = 400;
            bg.grid.light2.color.set(0x8B4513);
            bg.grid.light2.intensity = 200;

            // Ustawienie świateł na środku ekranu, za modelem 3D (Z=-100)
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            bg.grid.light1.position.set(centerX, centerY, -100);
            bg.grid.light2.position.set(centerX, centerY, -100);

            bg.camera.zoom = 1;
            bg.camera.updateProjectionMatrix();

            // Odłączenie wszystkich zdarzeń myszy
            canvas.removeEventListener('mousemove', bg.grid.onMouseMove);
            canvas.removeEventListener('wheel', bg.grid.onMouseWheel);
            canvas.removeEventListener('touchmove', bg.grid.onTouchMove);

            // Pętla animacyjna zapewniająca statyczną pozycję świateł
            function animate() {
                bg.grid.light1.position.set(centerX, centerY, -100);
                bg.grid.light2.position.set(centerX, centerY, -100);
                requestAnimationFrame(animate);
            }
            animate();

            window.addEventListener('resize', () => {
                const width = window.innerWidth;
                const height = window.innerHeight;
                bg.renderer.setSize(width, height);
                bg.camera.aspect = width / height;
                bg.camera.updateProjectionMatrix();
                // Aktualizacja pozycji świateł przy zmianie rozmiaru okna
                bg.grid.light1.position.set(width / 2, height / 2, -100);
                bg.grid.light2.position.set(width / 2, height / 2, -100);
            });
        })
        .catch((error) => console.error('Błąd podczas ładowania tła:', error));
} catch (error) {
    console.error('Błąd podczas importowania modułu:', error);
}

// Funkcja do generowania randomowego linku
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

// Animacja sekcji hero po załadowaniu strony
window.addEventListener('load', () => {
    document.querySelector('.hero h1').classList.add('animated-text');
    document.querySelector('.hero h2').classList.add('animated-text');
    document.querySelector('.hero h1').style.animation = 'fadeInUp 1s forwards 0.3s, glowText 1.5s ease-in-out forwards 0.3s';
    document.querySelector('.hero h2').style.animation = 'fadeInUp 1s forwards 0.4s, glowText 1.5s ease-in-out forwards 0.4s';
    document.querySelector('.hero p').style.animation = 'fadeInUp 1s forwards 0.6s';
    document.querySelector('.hero-buttons').style.animation = 'fadeInUp 1s forwards 0.9s';
});

// Obsługa przycisków
document.addEventListener('DOMContentLoaded', () => {
    const letsBeginBtn = document.getElementById('letsBeginBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    const backBtn = document.getElementById('backBtn');
    const heroSection = document.getElementById('hero-section');
    const formSection = document.getElementById('form-section');
    const indicators = document.querySelectorAll('.indicator');
    const steps = document.querySelectorAll('.step');
    const prevStepBtn = document.getElementById('prevStepBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    let currentStep = 0;

    // Funkcja do przełączania kroków
    function switchStep(newStep) {
        if (newStep >= 0 && newStep < steps.length) {
            steps[currentStep].classList.remove('active');
            indicators[currentStep].classList.remove('active');
            currentStep = newStep;
            steps[currentStep].classList.add('active');
            indicators[currentStep].classList.add('active');
        }
    }

    learnMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = getRandomLink();
    });

    letsBeginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        heroSection.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => {
            heroSection.style.display = 'none';
            formSection.style.display = 'flex';
            formSection.style.animation = 'fadeInUp 1s forwards';
        }, 1000);
    });

    backBtn.addEventListener('click', () => {
        formSection.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => {
            formSection.style.display = 'none';
            heroSection.style.display = 'flex';
            heroSection.style.animation = 'fadeInUp 1s forwards';
            // Reset animacji dla elementów hero
            document.querySelector('.hero h1').style.animation = 'none';
            document.querySelector('.hero h2').style.animation = 'none';
            document.querySelector('.hero p').style.animation = 'none';
            document.querySelector('.hero-buttons').style.animation = 'none';
            setTimeout(() => {
                document.querySelector('.hero h1').style.animation = 'fadeInUp 1s forwards 0.3s, glowText 1.5s ease-in-out forwards 0.3s';
                document.querySelector('.hero h2').style.animation = 'fadeInUp 1s forwards 0.4s, glowText 1.5s ease-in-out forwards 0.4s';
                document.querySelector('.hero p').style.animation = 'fadeInUp 1s forwards 0.6s';
                document.querySelector('.hero-buttons').style.animation = 'fadeInUp 1s forwards 0.9s';
            }, 10);
            // Reset formularza i kroku
            steps[currentStep].classList.remove('active');
            indicators[currentStep].classList.remove('active');
            currentStep = 0;
            steps[currentStep].classList.add('active');
            indicators[currentStep].classList.add('active');
        }, 1000);
    });

    // Nawigacja między krokami (kropki)
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            switchStep(index);
        });
    });

    // Nawigacja strzałkami wizualnymi
    prevStepBtn.addEventListener('click', () => {
        switchStep(currentStep - 1);
    });

    nextStepBtn.addEventListener('click', () => {
        switchStep(currentStep + 1);
    });

    // Nawigacja klawiaturą (strzałki lewo/prawo)
    document.addEventListener('keydown', (e) => {
        if (formSection.style.display !== 'none') {
            if (e.key === 'ArrowLeft') {
                switchStep(currentStep - 1);
            } else if (e.key === 'ArrowRight') {
                switchStep(currentStep + 1);
            }
        }
    });

    // Nawigacja swipe (przesunięcie palcem) na urządzeniach dotykowych
    const formSteps = document.querySelector('.form-steps');
    let touchStartX = 0;
    let touchEndX = 0;

    formSteps.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    formSteps.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            switchStep(currentStep + 1); // Swipe lewo -> następny krok
        } else if (touchEndX - touchStartX > 50) {
            switchStep(currentStep - 1); // Swipe prawo -> poprzedni krok
        }
    });

    // Submit formy (przykład)
    document.getElementById('submitForm').addEventListener('click', () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const industry = Array.from(document.querySelectorAll('input[name="industry"]:checked')).map(cb => cb.value);
        const occupation = document.getElementById('occupation').value;
        const experience = Array.from(document.querySelectorAll('input[name="experience"]:checked')).map(cb => cb.value);
        const fromBeginning = document.querySelector('input[name="fromBeginning"]:checked')?.value;

        console.log({ name, email, industry, occupation, experience, fromBeginning });
        alert('Formularz wysłany!'); // Możesz dostosować do wysyłki na serwer
    });
});

// Fallback dla modelu 3D
setTimeout(() => {
    const modelViewer = document.querySelector('model-viewer');
    const poster = document.querySelector('.model-placeholder');
    if (modelViewer && poster) {
        poster.style.display = 'flex';
    }
}, 5000);
