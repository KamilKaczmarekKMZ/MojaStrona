// Import i inicjalizacja tła Hexagonal Grid
import Grid1Background from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.16/build/backgrounds/grid1.cdn.min.js'

const bg = Grid1Background(document.getElementById('webgl-canvas'))

// DOPASOWANE KOLORY POCZĄTKOWE - ELEGANCKA FIOLETOWO-GRANATOWA PALETA
// Ustawiamy kolory siatki (gradient przez podane kolory)
bg.grid.setColors([0x171842, 0x2C1742, 0x411742]) // Ciemny granat, Fioletowy granat, Głęboki fiolet
// Ustawiamy kolor i intensywność pierwszego światła (główne, fioletowe)
bg.grid.light1.color.set(0x9c27b0) // Średni fiolet - pasujący do palety
bg.grid.light1.intensity = 650 
// Ustawiamy kolor i intensywność drugiego światła (wypełniające, różowe)
bg.grid.light2.color.set(0xe91e63) // Różowo-fioletowy - dla kontrastu
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
  const modelViewer = document.querySelector('model-viewer');
  const maxRotation = 720;
  const scrollHeight = document.body.scrollHeight - window.innerHeight;
  let lastScrollY = 0;
  let velocity = 0;
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const scrollProgress = Math.min(scrollY / scrollHeight, 1);
    
    velocity = scrollY - lastScrollY;
    lastScrollY = scrollY;
    
    // Główna faza obrotu i początek ruchu w górę (0% - 20% scrolla)
    if (scrollProgress <= 0.2) {
      const rotation = (scrollProgress / 0.2) * maxRotation;
      const inertiaRotation = rotation + (velocity * 0.2);
      modelViewer.cameraOrbit = `${inertiaRotation}deg 90deg ${Math.sin(scrollProgress * Math.PI * 4) * 15}deg`;
      modelViewer.style.opacity = 1;
      
      // Jednoczesne skalowanie i przesuwanie w górę od razu
      const scale = 1 - (scrollProgress * 0.8); // Zmniejszanie od 1 do 0.2
      const yPos = 50 + (scrollProgress * 90); // Przesuwanie w górę od 50% do 140%
      
      modelViewer.style.transform = `translate(-50%, -${yPos}%) scale(${scale})`;
      modelViewer.style.filter = `drop-shadow(0 0 ${20 - (scrollProgress * 18)}px rgba(0, 255, 255, ${1 - (scrollProgress * 0.8)}))`;
    } 
    // Pozycja końcowa (powyżej 20% scrolla)
    else {
      modelViewer.style.transform = `translate(-50%, -140%) scale(0.2)`;
      modelViewer.style.opacity = 1;
      modelViewer.style.filter = `drop-shadow(0 0 2px rgba(0, 255, 255, 0.2))`;
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
});
