document.addEventListener('DOMContentLoaded', function() {
    let clickCount = 0;
    const winThreshold = 80;      // Le joueur doit cliquer 80 fois pour gagner
    const abandonThreshold = 30;  // Dès 30 clics, le bouton "Abandonner" apparaît
    let fakeCounter = 300;        // Valeur initiale pour le message de progression
  
    const clickButton = document.getElementById('clickButton');
    const progressMessage = document.getElementById('progressMessage');
    const abandonButton = document.getElementById('abandonButton');
    const finalMessage = document.getElementById('finalMessage');
  
    // Met à jour le message de progression tous les 10 clics
    function updateProgressMessage() {
      if (clickCount % 10 === 0 && clickCount > 0 && clickCount < winThreshold) {
        fakeCounter -= 10;
        progressMessage.innerHTML = "Encore " + fakeCounter;
        progressMessage.style.opacity = "1";
        setTimeout(() => {
          progressMessage.style.opacity = "0";
        }, 1000);
      }
    }
  
    // Gestion du clic sur le bouton central
    clickButton.addEventListener('click', function() {
      clickCount++;
      // Rétrécir le bouton progressivement (taille minimale de 50px)
      const newSize = Math.max(50, 150 - clickCount * 2);
      clickButton.style.width = newSize + "px";
      clickButton.style.height = newSize + "px";
  
      updateProgressMessage();
  
      // Afficher le bouton "Abandonner" dès que 30 clics sont atteints
      if (clickCount >= abandonThreshold) {
        abandonButton.style.display = "block";
      }
  
      // Si le joueur atteint le seuil de victoire (80 clics)
      if (clickCount >= winThreshold) {
        winGame();
      }
    });
  
    // Lorsque l'utilisateur clique sur "Abandonner"
    abandonButton.addEventListener('click', function() {
      // Effacer tout le contenu
      document.body.innerHTML = "";
      // Créer un élément pour le message d'abandon
      const abandonMsg = document.createElement('div');
      abandonMsg.style.position = "absolute";
      abandonMsg.style.top = "50%";
      abandonMsg.style.left = "50%";
      abandonMsg.style.transform = "translate(-50%, -50%)";
      abandonMsg.style.fontSize = "36px";
      abandonMsg.style.color = "#fff";
      abandonMsg.style.textAlign = "center";
      // Message reformulé dans un ton naturel et jeune
      abandonMsg.innerHTML = "Tu es paresseux, tu abandonnes à la fin ? Quelle triste fin.";
      document.body.appendChild(abandonMsg);
      setTimeout(() => {
        window.location.href = "index.html";
      }, 4000);
    });
  
    // Fonction de victoire : effacer tout et afficher "Envie" au centre qui disparaît progressivement
    function winGame() {
      // Effacer tout le contenu
      document.body.innerHTML = "";
      const winDiv = document.createElement('div');
      winDiv.style.position = "absolute";
      winDiv.style.top = "50%";
      winDiv.style.left = "50%";
      winDiv.style.transform = "translate(-50%, -50%)";
      winDiv.style.fontSize = "36px";
      winDiv.style.color = "#fff";
      winDiv.style.textAlign = "center";
      winDiv.textContent = "Paresse";
      document.body.appendChild(winDiv);
      // Configurer la transition de fade-out (3 secondes)
      winDiv.style.transition = "opacity 3s";
      // Forcer un reflow
      void winDiv.offsetWidth;
      // Déclencher le fade-out
      winDiv.style.opacity = "0";
      winDiv.addEventListener('transitionend', function() {
        window.location.href = "final.html";
      });
    }
  });
  