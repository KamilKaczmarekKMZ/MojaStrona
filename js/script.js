document.addEventListener('DOMContentLoaded', () => {
  const modelViewer = document.querySelector('model-viewer');
  const buttonContainer = document.querySelector('.button-container');
  const bottomButtons = document.querySelector('.button-container-bottom');
  const maxRotation = 720;
  const scrollHeight = document.body.scrollHeight - window.innerHeight;
  let lastScrollY = 0;
  let velocity = 0;
  
  // Funkcja do animacji słów na pierwszym ekranie
  const animateInitialWords = () => {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
      // Resetujemy animację dla każdego słowa
      item.style.animation = 'none';
      void item.offsetWidth; // Trigger reflow
      item.style.animation = '';
    });
  };

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
    else if (scrollProgress >= 0.95) {
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

  // Uruchamiamy animację słów na starcie
  animateInitialWords();
  
  // Obsługa scrolla
  let isScrolling = false;
  const smoothHandleScroll = () => {
    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(() => {
        handleScroll();
        isScrolling = false;
      });
    }
  };

  window.addEventListener('scroll', smoothHandleScroll, { passive: true });
  handleScroll(); // Inicjalne wywołanie
});
