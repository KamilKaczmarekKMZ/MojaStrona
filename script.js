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
    document.querySelector('.hero h1').style.animation = 'fadeInUp 1s forwards 0.3s';
    document.querySelector('.hero p').style.animation = 'fadeInUp 1s forwards 0.6s';
    document.querySelector('.hero-buttons').style.animation = 'fadeInUp 1s forwards 0.9s';
});

// Obsługa przycisków
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('letsBeginBtn').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = getRandomLink();
    });

    document.getElementById('learnMoreBtn').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = getRandomLink();
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
