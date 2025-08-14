document.addEventListener('DOMContentLoaded', () => {
  // Konfiguracja
  const config = {
    animationDuration: 3000,
    delayBetweenWords: 150,
    maxActiveWords: 12,
    wordPopDistance: 500
  };

  // Elementy DOM
  const gridItems = document.querySelectorAll('.grid-item');
  const modelViewer = document.querySelector('model-viewer');
  const button = document.getElementById('scroll-button');

  // Inicjalizacja - ukryj wszystkie słowa
  gridItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = `translateZ(-${config.wordPopDistance}px)`;
  });

  // Funkcja animacji słowa
  function animateWord(word) {
    word.style.animation = `word-pop ${config.animationDuration}ms forwards`;
    word.style.opacity = '1';
    
    setTimeout(() => {
      word.style.animation = '';
      word.style.opacity = '0';
      word.style.transform = `translateZ(-${config.wordPopDistance}px)`;
      scheduleNextAnimation(word);
    }, config.animationDuration);
  }

  // Planowanie następnej animacji
  function scheduleNextAnimation(word) {
    const delay = Math.random() * 2000 + 1000;
    setTimeout(() => animateWord(word), delay);
  }

  // Start animacji
  function startAnimation() {
    // Pierwsza fala animacji
    const initialWords = Array.from(gridItems)
      .sort(() => Math.random() - 0.5)
      .slice(0, config.maxActiveWords);
    
    initialWords.forEach((word, i) => {
      setTimeout(() => animateWord(word), i * config.delayBetweenWords);
    });

    // Kontynuacja animacji dla wszystkich słów
    gridItems.forEach(word => scheduleNextAnimation(word));
  }

  // Inicjalizacja
  startAnimation();

  // Obsługa przycisku (opcjonalna)
  if (button) {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      // Tutaj dodaj swoją akcję
    });
  }
});
