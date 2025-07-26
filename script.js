// script.js
document.addEventListener('DOMContentLoaded', function() {
    /* --- Partie Connexion --- */
    const loginPage = document.getElementById('login-page');
    const gameContainer = document.getElementById('game-container');
    const passwordInput = document.getElementById('password-input');
    const enterButton = document.getElementById('enter-button');
    const loginError = document.getElementById('login-error');
    const MOT_DE_PASSE = "Confiance"; // Mot de passe requis
  
    enterButton.addEventListener('click', function() {
      if (passwordInput.value === MOT_DE_PASSE) {
        // Bonne connexion, on passe au jeu
        loginPage.classList.add('hidden');
        gameContainer.classList.remove('hidden');
      } else {
        // Affiche une erreur
        loginError.classList.remove('hidden');
      }
    });
  
    /* --- Partie Jeu de la Colère --- */
    const circle = document.getElementById('circle');
    const message = document.getElementById('message');
  
    // Seuils de clics
    const thresholdIntermediate = 10; // Pour "Ça t'énerve pas vrai ?"
    const thresholdFinal = 20;        // Pour "Colère"
    let clickCount = 0;
    let isProcessingClick = false;
    let intermediateShown = false;
  
    // Fonction pour repositionner le cercle aléatoirement
    function moveCircle() {
      const maxX = gameContainer.clientWidth - circle.offsetWidth;
      const maxY = gameContainer.clientHeight - circle.offsetHeight;
      const randomX = Math.floor(Math.random() * maxX);
      const randomY = Math.floor(Math.random() * maxY);
      circle.style.left = randomX + 'px';
      circle.style.top = randomY + 'px';
    }
  
    // Affiche un message avec animation, puis appelle callback quand terminé.
    function showAnimatedMessage(text, callback) {
      message.textContent = text;
      message.classList.remove('hidden');
      // Forcer le reflow pour démarrer l'animation
      void message.offsetWidth;
      message.classList.add('fade-out');
  
      message.addEventListener('animationend', function handler() {
        message.classList.remove('fade-out');
        message.classList.add('hidden');
        message.removeEventListener('animationend', handler);
        if (callback) callback();
      });
    }
  
    // Gestion du clic sur le cercle
    circle.addEventListener('click', function() {
      if (isProcessingClick) return;
      isProcessingClick = true;
      clickCount++;
  
      if (!intermediateShown && clickCount === thresholdIntermediate) {
        intermediateShown = true;
        circle.style.pointerEvents = 'none';
        showAnimatedMessage("Ça t'énerve pas vrai ?", function() {
           circle.style.pointerEvents = 'auto';
           isProcessingClick = false;
        });
      } else if (clickCount === thresholdFinal) {
        circle.style.display = 'none';
        showAnimatedMessage("Colère", function() {
           isProcessingClick = false;
        });
      } else {
        moveCircle();
        isProcessingClick = false;
      }
    });
  
    // Position initiale du cercle dans le jeu
    moveCircle();
  });
  