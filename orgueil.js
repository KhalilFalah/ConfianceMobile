document.addEventListener('DOMContentLoaded', function() {
    // Sélection des éléments du DOM
    const intro = document.getElementById('intro');
    const game = document.getElementById('game');
    const leftTower = document.getElementById('left-tower');
    const playerTower = document.getElementById('player-tower');
    const rightTower = document.getElementById('right-tower');
    const message = document.getElementById('message');
    const stopButton = document.getElementById('stop');
    
    // Paramètres des tours fixes (hauteurs en pixels)
    const leftTowerTarget = 200;   // Tour de gauche
    const rightTowerTarget = 300;  // Tour de droite
    let playerTowerHeight = 0;     // Hauteur actuelle de la tour du joueur
    let floorCount = 0;            // Nombre d'étages ajoutés au joueur
  
    // Fonction de construction des tours fixes avec des briques de 50px
    function buildFixedTower(towerEl, totalHeight, brickColor) {
      towerEl.innerHTML = "";
      const brickH = 50;
      const count = Math.floor(totalHeight / brickH);
      for (let i = 0; i < count; i++) {
        const brick = document.createElement('div');
        brick.className = 'floor';
        brick.style.height = brickH + "px";
        brick.style.background = brickColor;
        towerEl.appendChild(brick);
      }
    }
    buildFixedTower(leftTower, leftTowerTarget, "#555");
    buildFixedTower(rightTower, rightTowerTarget, "#777");
  
    // Lancement du jeu après l'introduction (3 secondes)
    setTimeout(() => {
      intro.style.opacity = 0;
      setTimeout(() => {
        intro.style.display = "none";
        game.style.display = "block";
      }, 1000);
    }, 3000);
  
    // Définition des hauteurs ajoutées en fonction du type de brique
    const brickHeights = {
      modeste: 50,
      imposant: 100,
      majestueux: 150
    };
  
    // Fonction globale pour ajouter une brique à la tour du joueur
    window.addFloor = function(type) {
      let addedHeight = brickHeights[type] || 0;
      let color = "";
      if (type === "modeste") {
        color = "gray";
      } else if (type === "imposant") {
        color = "silver";
      } else if (type === "majestueux") {
        color = "gold";
      }
      floorCount++;
      const brick = document.createElement('div');
      brick.className = `floor ${type}`;
      brick.style.height = addedHeight + "px";
      brick.style.background = color;
      // Ajout en bas de la tour (colonne inversée)
      playerTower.appendChild(brick);
      playerTowerHeight += addedHeight;
      
      // Affichage d'un message d'encouragement
      let msg = "";
      if (floorCount === 1) msg = "Tu surpasses déjà les autres !";
      else if (floorCount === 2) msg = "Ta grandeur commence à briller.";
      else if (floorCount === 3) msg = "Ils te regardent tous d’en bas.";
      else if (floorCount >= 4) msg = "Es-tu sûr de vouloir plus ?";
      message.innerHTML = msg;
      message.style.opacity = "1";
      setTimeout(() => {
        message.style.opacity = "0";
      }, 2000);
  
      // Vérifier immédiatement l'effondrement si la tour dépasse la tour de droite
      if (playerTowerHeight > rightTowerTarget) {
        // Effondrement : effacer tous les éléments et afficher le message de défaite au centre
        game.innerHTML = "";
        const defeatMsg = document.createElement('div');
        defeatMsg.style.position = "absolute";
        defeatMsg.style.top = "50%";
        defeatMsg.style.left = "50%";
        defeatMsg.style.transform = "translate(-50%, -50%)";
        defeatMsg.style.fontSize = "2em";
        defeatMsg.style.color = "white";
        defeatMsg.style.textAlign = "center";
        defeatMsg.innerHTML = "Ta tour s'est effondrée sous le poids de ton orgueil.<br>Être au-dessus ne fait pas tout.<br>Recommence.";
        game.appendChild(defeatMsg);
        setTimeout(() => {
          window.location.href = "index.html";
        }, 4000);
      }
    };
  
    // Fonction exécutée lorsque l'utilisateur clique sur "Je m’arrête là"
    function stopBuilding() {
      if (playerTowerHeight < leftTowerTarget) {
        message.innerHTML = "Tu te sous-estimes.";
        message.style.opacity = "1";
        setTimeout(() => {
          message.style.opacity = "0";
        }, 2000);
      } else {
        finalVictory();
      }
    }
    stopButton.addEventListener('click', stopBuilding);
  
    // Fonction de victoire : tout effacer et afficher "Orgueil" au centre avec fade-out, puis rediriger vers paresse.html
    function finalVictory() {
        // Effacer le contenu actuel de la zone de jeu
        game.innerHTML = "";
        
        // Créer un nouvel élément pour afficher le message "Orgueil"
        const victoryDiv = document.createElement('div');
        victoryDiv.id = 'final-message';
        victoryDiv.style.position = "absolute";
        victoryDiv.style.top = "50%";
        victoryDiv.style.left = "50%";
        victoryDiv.style.transform = "translate(-50%, -50%)";
        victoryDiv.style.fontSize = "4em";
        victoryDiv.style.color = "white";
        victoryDiv.style.textAlign = "center";
        victoryDiv.style.opacity = "1"; // Opacité initiale
        // Configurer la transition de l'opacité sur 3 secondes
        victoryDiv.style.transition = "opacity 3s";
        victoryDiv.textContent = "Orgueil";
        
        // Ajouter l'élément au jeu
        game.appendChild(victoryDiv);
      
        // Forcer un reflow pour s'assurer que la transition démarre
        void victoryDiv.offsetWidth;
        
        // Déclencher la transition en réglant l'opacité sur 0 (ce qui fera disparaître l'élément progressivement)
        victoryDiv.style.opacity = "0";
      
        // Après la durée de la transition (3s + 500ms de marge), rediriger vers la page suivante
        setTimeout(() => {
          window.location.href = "paresse.html";
        }, 3500);
      }
      
      
  });
  