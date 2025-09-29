// Import i inicjalizacja tła Hexagonal Grid
try {
    import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.16/build/backgrounds/grid1.cdn.min.js')
        .then((module) => {
            const Grid1Background = module.default;
            const canvas = document.getElementById('webgl-canvas');
            const bg = Grid1Background(canvas);
            bg.grid.setColors([0xC9AD92, 0x473523, 0xD8C4B0]);
            bg.grid.light1.color.set(0xF5F5DC);
            bg.grid.light1.intensity = 650;
            bg.grid.light2.color.set(0x8B4513);
            bg.grid.light2.intensity = 350;
            bg.camera.zoom = 1;
            bg.camera.updateProjectionMatrix();

            canvas.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
            canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

            window.addEventListener('resize', () => {
                const width = window.innerWidth;
                const height = window.innerHeight;
                bg.renderer.setSize(width, height);
                bg.camera.aspect = width / height;
                bg.camera.updateProjectionMatrix();
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
