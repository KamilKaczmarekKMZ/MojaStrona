document.addEventListener('DOMContentLoaded', () => {
  const gridItems = document.querySelectorAll('.grid-item');
  const modelViewer = document.querySelector('model-viewer');
  const buttonContainer = document.querySelector('.button-container');
  const bottomButtons = document.querySelector('.button-container-bottom');

  // Konfiguracja animacji
  const ANIMATION_DURATION = 3000; // 3s na pełny cykl (zoom-in + zoom-out)
  const DELAY_BETWEEN_WORDS = 150; // Opóźnienie między aktywacją słów (ms)
  const MAX_ACTIVE_WORDS = 10;     // Maksymalna liczba widocznych słów jednocześnie

  // Przygotuj słowa do animacji
  let activeWords = 0;

  // Funkcja animująca pojawienie się i zniknięcie słowa
  function animateWord(word) {
    if (activeWords >= MAX_ACTIVE_WORDS) return;

    activeWords++;
    word.style.opacity = '1';
    word.style.animation = 'zoom-in 3s forwards, flicker 1.5s infinite';

    // Reset animacji po zakończeniu
    setTimeout(() => {
      word.style.opacity = '0';
      word.style.animation = 'none';
      activeWords--;
    }, ANIMATION_DURATION);
  }

  // Automatyczna pętla animacji
  function startAnimationLoop() {
    // Losowe opóźnienie dla bardziej organicznego efektu
    const randomDelay = Math.random() * 2000;

    setTimeout(() => {
      const inactiveWords = Array.from(gridItems).filter(word => 
        word.style.opacity !== '1'
      );

      if (inactiveWords.length > 0) {
        const randomWord = inactiveWords[
          Math.floor(Math.random() * inactiveWords.length)
        ];
        animateWord(randomWord);
      }

      startAnimationLoop(); // Zapętlenie
    }, DELAY_BETWEEN_WORDS + randomDelay);
  }

  // Inicjalizacja
  function init() {
    // Ukryj dolne przyciski (nie są już potrzebne na pierwszym ekranie)
    if (bottomButtons) bottomButtons.style.display = 'none';

    // Ustaw model 3D w domyślnej pozycji
    if (modelViewer) {
      modelViewer.cameraOrbit = '0deg 90deg 0deg';
      modelViewer.style.opacity = '1';
    }

    // Start animacji słów
    startAnimationLoop();

    // Obsługa przycisku "Click me to enter" (opcjonalnie)
    const enterButton = document.getElementById('scroll-button');
    if (enterButton) {
      enterButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Tutaj możesz dodać akcję po kliknięciu (np. przejście do innej sekcji)
        console.log('Przycisk kliknięty!');
      });
    }
  }

  // Uruchom inicjalizację
  init();
});
