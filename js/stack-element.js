// js/stack-element.js

// Używamy 'DOMContentLoaded' dla pewności, że elementy istnieją
document.addEventListener('DOMContentLoaded', () => {
  // KLUCZOWA ZMIANA: Szukamy elementów WEWNĄTRZ naszej nowej sekcji
  // Używamy 'querySelector' z selektorem '.new-stack-section ...'
  const stackSection = document.querySelector('.new-stack-section');
  
  // Jeśli sekcja nie istnieje, przerywamy wykonanie skryptu
  if (!stackSection) return; 
  
  // Szukamy elementów WEWNĄTRZ sekcji, a nie w całym dokumencie
  const stack = stackSection.querySelector('.stack');
  const cards = stackSection.querySelectorAll('.card');
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Progres bazowany na pozycji scrolla (0-1)
    let progress = scrollY / (documentHeight - windowHeight);
    
    // Ogranicz progres do zakresu 0-1
    progress = Math.max(0, Math.min(1, progress));
    
    // Ustaw zmienną CSS dla wszystkich elementów
    // (sprawdzamy czy elementy istnienie przed manipulacją)
    if (stack) stack.style.setProperty('--scroll-progress', progress);
    cards.forEach(card => {
      card.style.setProperty('--scroll-progress', progress);
    });
  };

  // Użyj requestAnimationFrame dla płynności
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

  // Dodajemy nasłuchiwanie scrolla
  window.addEventListener('scroll', onScroll);
  
  // Inicjalizujemy wartości na starcie
  handleScroll();
});
