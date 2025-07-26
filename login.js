document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password-input');
    const enterButton = document.getElementById('enter-button');
    const confirmationMessage = document.getElementById('confirmation-message');
    const loginError = document.getElementById('login-error');
    const MOT_DE_PASSE = "Confiance";
    let confirmationPending = false;
  
    enterButton.addEventListener('click', function() {
      // Réinitialiser le message d'erreur à chaque clic
      loginError.classList.add('hidden');
  
      if (passwordInput.value === MOT_DE_PASSE) {
        if (!confirmationPending) {
          // Afficher le message de confirmation
          confirmationMessage.classList.remove('hidden');
          confirmationPending = true;
        } else {
          // Confirmation effectuée, rediriger vers la page du jeu
          window.location.href = "colere.html";
        }
      } else {
        // Mot de passe incorrect : afficher l'erreur et réinitialiser
        loginError.classList.remove('hidden');
        passwordInput.value = "";
        confirmationMessage.classList.add('hidden');
        confirmationPending = false;
      }
    });
  });
  