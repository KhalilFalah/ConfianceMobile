document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('playButton');
    const skipButton = document.getElementById('skipButton');
    const intro = document.getElementById('intro');
    const finalMessage = document.getElementById('finalMessage');
  
    // Si l'utilisateur choisit de jouer, redirige vers la page paresse_2.html (le vrai jeu)
    playButton.addEventListener('click', function() {
      window.location.href = "paresse_2.html";
    });
  
    // Si l'utilisateur choisit de "passer à la fin"
    skipButton.addEventListener('click', function() {
      // Masquer l'introduction
      intro.style.display = "none";
      // Afficher le message final au centre
      finalMessage.innerHTML = "Si tu as commencé, va jusqu'au bout.<br>Tu es paresseux, abandonner n'est pas une option. Recommence.";
      finalMessage.style.opacity = "1";
      // Après 4 secondes, déclencher le fade-out puis rediriger vers index.html
      setTimeout(function() {
        finalMessage.style.opacity = "0";
        setTimeout(function() {
          window.location.href = "index.html";
        }, 1000);
      }, 4000);
    });
  });
  