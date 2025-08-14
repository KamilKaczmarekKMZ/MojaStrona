document.addEventListener('DOMContentLoaded', () => {
  const gridItems = document.querySelectorAll('.grid-item');
  
  // Natychmiast ukryj wszystkie słowa
  gridItems.forEach(item => {
    item.style.opacity = '0';
    item.style.animation = 'none';
  });

  // Konfiguracja animacji
  const ANIMATION_DURATION = 3000;
  const DELAY_BETWEEN_WORDS = 150;
  const MAX_ACTIVE_WORDS = 10;

  let activeWords = 0;

  function animateWord(word) {
    if (activeWords >= MAX_ACTIVE_WORDS) return;
    
    activeWords++;
    word.style.animation = 'zoom-in 3s forwards, flicker 1.5s infinite';
    word.style.opacity = '1';

    setTimeout(() => {
      word.style.opacity = '0';
      word.style.animation = 'none';
      activeWords--;
    }, ANIMATION_DURATION);
  }

  function startAnimation() {
    // Pierwsza partia słów (start od razu)
    const initialWords = Array.from(gridItems)
      .sort(() => 0.5 - Math.random())
      .slice(0, MAX_ACTIVE_WORDS);
    
    initialWords.forEach((word, i) => {
      setTimeout(() => animateWord(word), i * DELAY_BETWEEN_WORDS);
    });

    // Pętla dla reszty słów
    setInterval(() => {
      const inactiveWords = Array.from(gridItems).filter(word => 
        word.style.opacity !== '1'
      );
      
      if (inactiveWords.length > 0) {
        const randomWord = inactiveWords[
          Math.floor(Math.random() * inactiveWords.length)
        ];
        animateWord(randomWord);
      }
    }, DELAY_BETWEEN_WORDS * MAX_ACTIVE_WORDS);
  }

  startAnimation();
});
