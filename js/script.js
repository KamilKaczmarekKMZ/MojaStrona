document.addEventListener('DOMContentLoaded', () => {
  const words = [
    "Growth", "Automation", "Income", "Scalability", "Innovation", 
    "Strategy", "Marketing", "Sales", "Networking", "Productivity",
    "Efficiency", "Investment", "Partnership", "Loyalty", "Optimization",
    "Analytics", "ROI", "Competitive Advantage", "Expansion", "MVP",
    "Cash Flow", "KPIs", "Digital Transformation", "scale", "Sustainability",
    "Remote Work", "AI", "CRM", "SEO", "Exit Strategy",
    "Bootstrapping", "Monetization", "B2B", "B2C", "Pivot",
    "Workflow", "Data-Driven", "Scalable Model", "Business Intelligence", "Traction",
    "Upselling", "Value Proposition", "ChatBot", "Revenue Stream", "Business Agility",
    "Proof of Concept", "Hyperautomation", "Growth Hacking"
  ];

  // Konfiguracja
  const CONFIG = {
    activeWords: 12,     // Stała liczba widocznych słów
    animationDuration: 3000,
    delayBetweenWords: 300
  };

  // Kontener
  const container = document.querySelector('body');
  
  // Inicjalizacja słów
  words.forEach(word => {
    const el = document.createElement('div');
    el.className = 'grid-item';
    el.textContent = word;
    container.appendChild(el);
  });

  const gridItems = document.querySelectorAll('.grid-item');

  // Funkcja losowej pozycji (gwarantuje, że słowo będzie na ekranie)
  function getRandomPosition() {
    const padding = 20;
    return {
      left: padding + Math.random() * (window.innerWidth - 2 * padding),
      top: padding + Math.random() * (window.innerHeight - 2 * padding)
    };
  }

  // Animacja słowa
  function animateWord(word) {
    const pos = getRandomPosition();
    word.style.left = `${pos.left}px`;
    word.style.top = `${pos.top}px`;
    word.style.animation = `zoom-in ${CONFIG.animationDuration}ms forwards, flicker 1.5s infinite`;
    word.style.opacity = '1';

    setTimeout(() => {
      word.style.animation = 'none';
      word.style.opacity = '0';
      setTimeout(() => animateWord(word), CONFIG.delayBetweenWords);
    }, CONFIG.animationDuration);
  }

  // Start animacji
  function startAnimation() {
    gridItems.forEach((word, index) => {
      setTimeout(() => {
        animateWord(word);
        setInterval(() => animateWord(word), 
          CONFIG.animationDuration * 2 + CONFIG.delayBetweenWords * gridItems.length);
      }, index * CONFIG.delayBetweenWords);
    });
  }

  startAnimation();
});
