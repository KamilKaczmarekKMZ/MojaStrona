document.addEventListener('DOMContentLoaded', () => {
  const stack = document.querySelector('.stack');
  const cards = document.querySelectorAll('.card');
  const processContainer = document.querySelector('.process-container');
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Progres bazowany na pozycji scrolla (0-1)
    let progress = (scrollY - (windowHeight * 0.3)) / (documentHeight - windowHeight * 1.5);
    
    // Ogranicz progres do zakresu 0-1
    progress = Math.max(0, Math.min(1, progress));
    
    // Pokaż/ukryj kontener
    if (progress > 0.1) {
      processContainer.classList.add('visible');
    } else {
      processContainer.classList.remove('visible');
    }
    
    // Ustaw zmienną CSS dla wszystkich elementów
    stack.style.setProperty('--scroll-progress', progress);
    cards.forEach(card => {
      card.style.setProperty('--scroll-progress', progress);
    });
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
