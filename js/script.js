// script.js - CAŁY NOWY KOD
document.addEventListener('DOMContentLoaded', () => {
  const modelViewer = document.querySelector('model-viewer');
  const buttonContainer = document.querySelector('.button-container');
  const bottomButtons = document.querySelector('.button-container-bottom');
  const gridItems = document.querySelectorAll('.grid-item');
  const animationDuration = 20000; // 20 sekund
  let animationStart;
  let isScrolling = false;

  // Funkcja animacji słów
  function animateWords(timestamp) {
    if (!animationStart) animationStart = timestamp;
    const elapsed = timestamp - animationStart;
    const progress = (elapsed % animationDuration) / animationDuration;

    gridItems.forEach((item, index) => {
      const rangeStart = parseFloat(item.style.getPropertyValue('--range-start') || 0);
      const rangeEnd = parseFloat(item.style.getPropertyValue('--range-end') || 1);
      const rangeDuration = rangeEnd - rangeStart;
      
      // Oblicz progres dla danego elementu
      let elementProgress;
      if (progress >= rangeStart && progress <= rangeEnd) {
        elementProgress = (progress - rangeStart) / rangeDuration;
      } else if (progress < rangeStart) {
        elementProgress = 0;
      } else {
        elementProgress = 1;
      }

      // Zastosuj transformacje
      const scale = 1 + Math.sin(elementProgress * Math.PI) * 0.5;
      const opacity = Math.min(elementProgress * 3, 1, (1 - elementProgress) * 3);
      const blur = 5 - (elementProgress * 5);
      
      item.style.transform = `translateZ(${(1 - elementProgress) * 1000}px) scale(${scale})`;
      item.style.opacity = opacity;
      item.style.filter = `blur(${blur}px)`;
    });

    if (!isScrolling) {
      requestAnimationFrame(animateWords);
    }
  }

  // Inicjalizacja zakresów animacji
  function initAnimationRanges() {
    // Ustawiamy zakresy dla każdego elementu (zachowujemy oryginalne proporcje)
    const totalItems = gridItems.length;
    gridItems.forEach((item, index) => {
      const start = index * 0.02; // Rozkładamy równomiernie w ciągu 20 sekund
      const end = start + 0.1; // Każde słowo jest widoczne przez 2 sekundy
      
      item.style.setProperty('--range-start', start);
      item.style.setProperty('--range-end', end);
    });
  }

  // Obsługa przycisku
  document.getElementById('scroll-button').addEventListener('click', function(e) {
    e.preventDefault();
    isScrolling = true;
    
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
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        isScrolling = false;
        animationStart = null; // Reset animacji
        requestAnimationFrame(animateWords);
      }
    }
    
    requestAnimationFrame(animation);
  });

  function easeInOutQuad(t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
  }

  // Inicjalizacja
  initAnimationRanges();
  requestAnimationFrame(animateWords);

  // Obsługa pojawiania się dolnych przycisków
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    const bottomThreshold = 0.7;
    
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
  });
});
