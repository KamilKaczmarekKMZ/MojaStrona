// Import i inicjalizacja tła Hexagonal Grid
import Grid1Background from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.16/build/backgrounds/grid1.cdn.min.js'

const bg = Grid1Background(document.getElementById('webgl-canvas'))

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
  const buttonContainer = document.querySelector('.button-container');
  const bottomButtons = document.querySelector('.button-container-bottom');
  const maxRotation = 720;
  const scrollHeight = document.body.scrollHeight - window.innerHeight;
  let lastScrollY = 0;
  let velocity = 0;
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const scrollProgress = Math.min(scrollY / scrollHeight, 1);
    const bottomThreshold = 0.7;
    
    velocity = scrollY - lastScrollY;
    lastScrollY = scrollY;
    
    if (scrollY >= scrollHeight * bottomThreshold) {
      const opacity = Math.min((scrollY - scrollHeight * bottomThreshold) / 500, 1);
      bottomButtons.style.opacity = opacity;
      bottomButtons.classList.add('visible');
      buttonContainer.style.opacity = 1 - opacity;
    } else {
      bottomButtons.style.opacity = '0';
      bottomButtons.classList.remove('visible');
      buttonContainer.style.opacity = '1';
    }
    
    if (scrollProgress <= 0.8) {
      const rotation = (scrollProgress / 0.8) * maxRotation;
      const inertiaRotation = rotation + (velocity * 0.2);
      modelViewer.cameraOrbit = `${inertiaRotation}deg 90deg ${Math.sin(scrollProgress * Math.PI * 4) * 15}deg`;
      modelViewer.style.opacity = 1;
      
      const scale = 1 + Math.sin(scrollProgress * Math.PI) * 0.2;
      modelViewer.style.transform = `translate(-50%, -50%) scale(${scale})`;
      modelViewer.style.filter = `drop-shadow(0 0 20px rgba(0, 255, 255, ${0.7 + Math.sin(scrollProgress * Math.PI) * 0.3}))`;
    } 
    else if (scrollProgress > 0.8 && scrollProgress < 0.95) {
      const transitionProgress = (scrollProgress - 0.8) / 0.15;
      const scale = 1 - (transitionProgress * 0.8);
      const yPos = 50 + (transitionProgress * 30);
      
      modelViewer.style.transform = `translate(-50%, -${yPos}%) scale(${scale})`;
      modelViewer.style.opacity = 1;
      modelViewer.style.filter = `drop-shadow(0 0 ${20 - (transitionProgress * 18)}px rgba(0, 255, 255, ${1 - (transitionProgress * 0.8)}))`;
    }
    else if (scrollProgress >= 0.20) {
      modelViewer.style.transform = `translate(-50%, -140%) scale(0.2)`;
      modelViewer.style.opacity = 1;
      modelViewer.style.filter = `drop-shadow(0 0 2px rgba(0, 255, 255, 0.2))`;
    }
  };

  document.getElementById('scroll-button').addEventListener('click', function(e) {
    e.preventDefault();
    const targetPosition = document.body.scrollHeight;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 10000;
    let startTime = null;
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function easeInOutQuad(t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t + b;
      t--;
      return -c/2 * (t*(t-2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
  });

  window.addEventListener('scroll', handleScroll);
  handleScroll();
});
