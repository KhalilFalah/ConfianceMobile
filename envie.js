document.addEventListener('DOMContentLoaded', function() {
    // Variables de suivi
    let choiceCount = 0;
    const maxChoices = 4; // Au 4ᵉ choix, le joueur perd
    let gameOverCalled = false; // Pour empêcher d'appeler la défaite plusieurs fois
  
    // Sélection des éléments du DOM
    const doorsContainer = document.getElementById('doors');
    const doorButtons = document.querySelectorAll('.door');
    const feedbackMessage = document.getElementById('feedback-message');
    const actionButtonContainer = document.getElementById('action-button-container');
    const actionButton = document.getElementById('action-button');
    const finalMessageContainer = document.getElementById('final-message-container');
    const instruction = document.getElementById('instruction'); // Pour masquer l'instruction si besoin
  
    // Messages de feedback (affichés en grand)
    const feedbackMessages = [
      "Encore !",
      "Tu mérites mieux, non ?",
      "Toujours plus !"
    ];
  
    // Données pour le bouton d'action, avec tailles croissantes et texte en capitalisation normale
    const actionButtonData = [
      { text: "Je suis assez", fontSize: "1.2em" },
      { text: "Je me suffit", fontSize: "1.5em" },
      { text: "Je suis complet", fontSize: "2em" }
    ];
  
    // Ajout de l'écouteur sur chaque porte
    doorButtons.forEach(button => {
      button.addEventListener('click', doorClicked);
    });
  
    function doorClicked(e) {
      if (gameOverCalled) return;
      choiceCount++;
      // Masquer les portes pour mettre en valeur le feedback et le bouton d'action
      doorsContainer.style.display = "none";
  
      // Si le 4ᵉ choix est atteint, c'est l'échec
      if (choiceCount >= maxChoices) {
        showFeedbackMessage(
          "Tu as dévalisé ce que les autres possèdent.<br>Mais qui es-tu devenue ?<br>L'envie t'a vidé.<br>Recommence.",
          () => { gameOverFailure(); },
          1500
        );
        return;
      }
      
      // Afficher le feedback correspondant s'il y a lieu
      if (choiceCount <= feedbackMessages.length) {
        showFeedbackMessage(feedbackMessages[choiceCount - 1], () => {
          // Une fois le feedback terminé, réafficher les portes
          doorsContainer.style.display = "grid";
        }, 1000);
      } else {
        setTimeout(() => {
          doorsContainer.style.display = "grid";
        }, 1000);
      }
      
      // Afficher le bouton d'action correspondant (s'il est défini)
      if (choiceCount <= actionButtonData.length) {
        showActionButton(actionButtonData[choiceCount - 1]);
      }
    }
  
    // Affiche un message de feedback en grand pendant une durée donnée
    function showFeedbackMessage(text, callback, duration) {
      feedbackMessage.innerHTML = text; // Utilisation de innerHTML pour conserver les <br>
      feedbackMessage.classList.remove('hidden');
      setTimeout(() => {
        feedbackMessage.classList.add('hidden');
        if (callback) callback();
      }, duration);
    }
  
    // Affiche le bouton d'action et le laisse visible pendant 2 secondes
    let actionButtonTimeout;
    function showActionButton(data) {
      actionButton.textContent = data.text;
      actionButton.style.fontSize = data.fontSize;
      actionButtonContainer.style.display = "block";
      clearTimeout(actionButtonTimeout);
      actionButtonTimeout = setTimeout(() => {
        actionButtonContainer.style.display = "none";
      }, 2000);
    }
  
    // Lorsque l'utilisateur clique sur le bouton d'action, il gagne
    actionButton.addEventListener('click', function() {
      clearTimeout(actionButtonTimeout);
      gameWin();
    });
  
    // Victoire : masque tous les éléments et affiche "Envie" centré en fade-out, puis redirige vers "Orgueil"
    function gameWin() {
      // Masquer tous les éléments de la page
      doorButtons.forEach(btn => btn.disabled = true);
      doorsContainer.style.display = "none";
      feedbackMessage.classList.add('hidden');
      actionButtonContainer.style.display = "none";
      if (instruction) {
        instruction.style.display = "none";
      }
      
      finalMessageContainer.innerHTML = "<div id='final-message' style='position: absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:4em; color:#fff;'>Envie</div>";
      const finalMessage = document.getElementById('final-message');
      finalMessage.classList.add('fade-out');
      finalMessage.addEventListener('animationend', function handler() {
        finalMessage.removeEventListener('animationend', handler);
        setTimeout(() => {
          window.location.href = "orgueil.html";
        }, 1500);
      });
    }
  
    // Défaite : si le joueur effectue un 4ᵉ choix
    function gameOverFailure() {
      if (gameOverCalled) return;
      gameOverCalled = true;
      finalMessageContainer.innerHTML = "<div id='failure-message' style='position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:2em; color:#fff; text-align:center;'>Tu as dévalisé ce que les autres possèdent.<br>Mais qui es-tu devenue ?<br>L'envie t'a vidé.<br>Recommence.</div>";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 5000);
    }
  });
  