
document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.getElementById("year");
  const goBackButton = document.getElementById("goBack");

  // Automatically update the copyright year
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Return to the previous page when possible
  if (goBackButton) {
    goBackButton.addEventListener("click", () => {
      if (window.history.length > 1 && document.referrer) {
        window.history.back();
      } else {
        window.location.href = "index.html";
      }
    });
  }
});
