// Import i inicjalizacja tła Hexagonal Grid
import Grid1Background from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.16/build/backgrounds/grid1.cdn.min.js'

const bg = Grid1Background(document.getElementById('webgl-canvas'))

// DOPASOWANE KOLORY POCZĄTKOWE - ZIEMISTA PALETA
// Ustawiamy kolory siatki (gradient przez podane kolory)
bg.grid.setColors([0xC9AD92, 0x473523, 0xD8C4B0]) // Jasny beż, Ciemny brąz, Średni beż
// Ustawiamy kolor i intensywność pierwszego światła (główne, kremowe)
bg.grid.light1.color.set(0xF5F5DC) // Kremowy/biały - bardziej neutralny
bg.grid.light1.intensity = 650 
// Ustawiamy kolor i intensywność drugiego światła (wypełniające, brązowe)
bg.grid.light2.color.set(0x8B4513) // Ciepły brąz - bardziej ziemisty
bg.grid.light2.intensity = 350 

// Obsługa przycisku zmiany kolorów tła
const button1 = document.getElementById('colors-btn')
button1.addEventListener('click', () => {
  bg.grid.setColors([0xffffff * Math.random(), 0xffffff * Math.random(), 0xffffff * Math.random()])
  bg.grid.light1.color.set(0xffffff * Math.random())
  bg.grid.light1.intensity = 500 + Math.random() * 1000
  bg.grid.light2.color.set(0xffffff * Math.random())
  bg.grid.light2.intensity = 250 + Math.random() * 250
})

// Oryginalny kod strony
document.addEventListener('DOMContentLoaded', () => {
  const modelContainer = document.querySelector('.model-container');
  const modelViewer = document.querySelector('model-viewer');
  const maxRotation = 720;
  let scrollHeight = document.body.scrollHeight - window.innerHeight;
  let lastScrollY = 0;
  let velocity = 0;
  let scrollRequestId = null;
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const scrollProgress = Math.min(scrollY / scrollHeight, 1);
    
    velocity = scrollY - lastScrollY;
    // Ograniczenie wartości velocity dla płynniejszej animacji
    velocity = Math.max(Math.min(velocity, 50), -50);
    lastScrollY = scrollY;
    
    // Główna faza obrotu i początek ruchu w górę (0% - 20% scrolla)
    if (scrollProgress <= 0.2) {
      const rotation = (scrollProgress / 0.2) * maxRotation;
      const inertiaRotation = rotation + (velocity * 0.2);
      
      // Jednoczesne skalowanie i przesuwanie w górę od razu
      const scale = 1 - (scrollProgress * 0.8); // Zmniejszanie od 1 do 0.2
      const yPos = 50 + (scrollProgress * 90); // Przesuwanie w górę od 50% do 140%
      
      // ZMIANA: rotateX na rotateY dla obrotu wokół osi Y (bok)
      modelContainer.style.transform = `translate(-50%, -${yPos}%) scale(${scale}) rotateY(${inertiaRotation}deg)`;
      modelContainer.style.opacity = 1;
      modelContainer.style.filter = `drop-shadow(0 0 ${20 - (scrollProgress * 18)}px rgba(255, 255, 255, ${1 - (scrollProgress * 0.8)}))`;
    } 
    // Pozycja końcowa (powyżej 20% scrolla)
    else {
      // ZMIANA: rotateX na rotateY
      modelContainer.style.transform = `translate(-50%, -140%) scale(0.2) rotateY(${maxRotation}deg)`;
      modelContainer.style.opacity = 1;
      modelContainer.style.filter = `drop-shadow(0 0 2px rgba(255, 255, 255, 0.2))`;
    }
    
    scrollRequestId = null;
  };

  // Obsługa zmiany rozmiaru okna
  const handleResize = () => {
    scrollHeight = document.body.scrollHeight - window.innerHeight;
    if (scrollRequestId) {
      cancelAnimationFrame(scrollRequestId);
    }
    scrollRequestId = requestAnimationFrame(handleScroll);
  };

  window.addEventListener('scroll', () => {
    if (!scrollRequestId) {
      scrollRequestId = requestAnimationFrame(handleScroll);
    }
  });

  window.addEventListener('resize', handleResize);
  
  // Inicjalne wywołanie
  handleScroll();

  // Czyszczenie przy opuszczeniu strony
  window.addEventListener('beforeunload', () => {
    if (scrollRequestId) {
      cancelAnimationFrame(scrollRequestId);
    }
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleScroll);
  });
});
