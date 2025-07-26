document.addEventListener('DOMContentLoaded', function() {
    // Références aux éléments du DOM
    const container = document.getElementById('avarice-container');
    const scoreDisplay = document.getElementById('score');
    const quitButton = document.getElementById('quit-button');
    const bag = document.getElementById('bag');
    const motivationDiv = document.getElementById('motivation-message');
    
    // Variables de jeu
    let score = 0;
    const coinValue = 100;                 // Chaque pièce rapporte 100 points
    const quitThreshold = 1000;            // Bouton Quitter dès 1000 points
    const failureThreshold = 1600;         // À 1600 points : échec (avarice excessive)
    let coins = [];                        // Liste des pièces actives
    let lastSpawnTime = 0;
    const spawnInterval = 1500;            // Moins de pièces tombent : toutes les 1,5 s
    const coinSpeed = 2;                   // Vitesse de chute des pièces (px par frame)
    let lastFrameTime = performance.now();
    let running = true;
    
    // Variables pour les messages motivants (affichés tous les 400 points)
    let nextMotivationThreshold = 400;
    let motivationIndex = 0;
    const motivationalMessages = [
      "Ramasse l'argent",
      "Aime l'argent",
      "Prend l'argent"
    ];
    
    // --- Gestion du contrôle du sac par glisser ---
    let dragging = false, dragOffsetX = 0;
    bag.addEventListener('mousedown', startDrag);
    bag.addEventListener('touchstart', startDrag);
    document.addEventListener('mousemove', duringDrag);
    document.addEventListener('touchmove', duringDrag, {passive: false});
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    
    function startDrag(e) {
      e.preventDefault();
      dragging = true;
      let clientX = e.touches ? e.touches[0].clientX : e.clientX;
      dragOffsetX = clientX - bag.getBoundingClientRect().left;
    }
    
    function duringDrag(e) {
      if (!dragging) return;
      e.preventDefault();
      let clientX = e.touches ? e.touches[0].clientX : e.clientX;
      let newX = clientX - dragOffsetX;
      // Limiter le mouvement du sac dans le container
      const containerRect = container.getBoundingClientRect();
      const bagRect = bag.getBoundingClientRect();
      if (newX < 0) newX = 0;
      if (newX + bagRect.width > containerRect.width)
        newX = containerRect.width - bagRect.width;
      bag.style.left = newX + 'px';
    }
    
    function endDrag(e) {
      dragging = false;
    }
    
    // --- Gestion de la création et mise à jour des pièces ---
    function spawnCoin() {
      const coin = document.createElement('div');
      coin.classList.add('coin');
      const coinSize = 30;  // Taille de la pièce en pixels
      coin.style.width = coinSize + 'px';
      coin.style.height = coinSize + 'px';
      coin.style.position = 'absolute';
      // Position x aléatoire, y juste au-dessus du container
      coin.style.left = Math.floor(Math.random() * (container.clientWidth - coinSize)) + 'px';
      coin.style.top = -coinSize + 'px';
      container.appendChild(coin);
      coins.push(coin);
    }
    
    function updateCoins(deltaTime) {
      for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        let top = parseFloat(coin.style.top);
        top += coinSpeed * (deltaTime / 16);
        coin.style.top = top + 'px';
        // Supprimer la pièce si elle sort du container
        if (top > container.clientHeight) {
          coin.remove();
          coins.splice(i, 1);
        }
        // Vérifier la collision entre la pièce et le sac
        else if (checkCollision(coin, bag)) {
          coin.remove();
          coins.splice(i, 1);
          score += coinValue;
          scoreDisplay.textContent = score;
          
          // Afficher le bouton Quitter dès que le score atteint le seuil
          if (score >= quitThreshold && quitButton.classList.contains('hidden')) {
            quitButton.classList.remove('hidden');
          }
          
          // Afficher un message motivant tous les 400 points
          if (score >= nextMotivationThreshold) {
            if (motivationIndex < motivationalMessages.length) {
              showMotivationMessage(motivationalMessages[motivationIndex]);
              motivationIndex++;
            }
            nextMotivationThreshold += 400;
          }
          
          // Échec : si le score atteint ou dépasse 1600 points
          if (score >= failureThreshold) {
            gameOverFailure();
          }
        }
      }
    }
    
    // Détection simple de collision entre deux éléments
    function checkCollision(div1, div2) {
      const rect1 = div1.getBoundingClientRect();
      const rect2 = div2.getBoundingClientRect();
      return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      );
    }
    
    // Afficher un message motivant pendant 1 seconde
    function showMotivationMessage(text) {
      motivationDiv.textContent = text;
      motivationDiv.classList.remove('hidden');
      setTimeout(() => {
        motivationDiv.classList.add('hidden');
      }, 1000);
    }
    
    // Fin de jeu en cas d'échec (score trop élevé)
    function gameOverFailure() {
      coins.forEach(coin => coin.remove());
      coins = [];
      container.innerHTML = "<div class='failure-message'>Pourquoi dépasser les autres quand il faut d'abord dépasser soi-même ?<br>Tu es avare, c'est de l'avarice, recommences</div>";
      running = false;
      // Laisser le message d'échec affiché plus longtemps (5000 ms) avant redirection
      setTimeout(() => {
        window.location.href = "index.html";
      }, 5000);
    }
    
    // Fin de jeu réussie (lorsque l'utilisateur clique sur Quitter)
    // Affiche "Avarice" centré avec l'animation fade-out, attend 1500 ms puis redirige vers le jeu Envie
    function gameOverSuccess() {
      coins.forEach(coin => coin.remove());
      coins = [];
      // Afficher le message "Avarice" centré sur la page
      container.innerHTML = "<div id='final-message' style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 4em; color: #fff;'>Avarice</div>";
      const finalMessage = document.getElementById('final-message');
      finalMessage.classList.add('fade-out');
      finalMessage.addEventListener('animationend', function handler() {
        finalMessage.removeEventListener('animationend', handler);
        setTimeout(() => {
          window.location.href = "envie.html";
        }, 1500);
      });
      running = false;
    }
    
    quitButton.addEventListener('click', function() {
      gameOverSuccess();
    });
    
    // Boucle principale du jeu
    function gameLoop(timestamp) {
      if (!running) return;
      let deltaTime = timestamp - lastFrameTime;
      lastFrameTime = timestamp;
      if (timestamp - lastSpawnTime > spawnInterval) {
        spawnCoin();
        lastSpawnTime = timestamp;
      }
      updateCoins(deltaTime);
      requestAnimationFrame(gameLoop);
    }
    
    lastFrameTime = performance.now();
    requestAnimationFrame(gameLoop);
  });
  