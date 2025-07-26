document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.getElementById('game-container');
    const circle = document.getElementById('circle');
    const message = document.getElementById('message');
  
    // Seuils de clics
    const thresholdIntermediate = 25; // Pour afficher "Ça t'énerve pas vrai ?"
    const thresholdFinal = 50;        // Pour afficher "Colère"
    let clickCount = 0;
    let isProcessingClick = false;
    let intermediateShown = false;
  
    // Repositionne le cercle aléatoirement dans le container
    function moveCircle() {
      const maxX = gameContainer.clientWidth - circle.offsetWidth;
      const maxY = gameContainer.clientHeight - circle.offsetHeight;
      const randomX = Math.floor(Math.random() * maxX);
      const randomY = Math.floor(Math.random() * maxY);
      circle.style.left = randomX + 'px';
      circle.style.top = randomY + 'px';
    }
  
    // Affiche un message avec une animation de disparition et appelle un callback à la fin
    function showAnimatedMessage(text, callback) {
      message.textContent = text;
      message.classList.remove('hidden');
      // Forcer le reflow pour redémarrer l'animation
      void message.offsetWidth;
      message.classList.add('fade-out');
  
      message.addEventListener('animationend', function handler() {
        message.classList.remove('fade-out');
        message.classList.add('hidden');
        message.removeEventListener('animationend', handler);
        if (callback) callback();
      });
    }
  
    circle.addEventListener('click', function() {
      if (isProcessingClick) return;
      isProcessingClick = true;
      clickCount++;
  
      if (!intermediateShown && clickCount === thresholdIntermediate) {
        intermediateShown = true;
        circle.style.pointerEvents = 'none'; // Désactive temporairement les clics
        showAnimatedMessage("Ça t'énerve pas vrai ?", function() {
           circle.style.pointerEvents = 'auto';
           isProcessingClick = false;
        });
      } else if (clickCount === thresholdFinal) {
        circle.style.display = 'none'; // Masque le cercle
        showAnimatedMessage("Colère", function() {
           isProcessingClick = false;
           // À la fin de l'animation finale dans colere.js
            setTimeout(() => {
            window.location.href = "avarice.html";
            }, 1500);
        });
      } else {
        moveCircle();
        isProcessingClick = false;
      }
    });
  
    
  
    // Position initiale du cercle au chargement de la page
    moveCircle();
  });
  