
document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     ELEMENTS
  ========================================= */

  const form = document.getElementById("signupForm");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("signupEmail");
  const passwordInput = document.getElementById("signupPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  const togglePassword = document.getElementById("togglePassword");
  const toggleConfirmPassword = document.getElementById(
    "toggleConfirmPassword"
  );

  const submitButton = form.querySelector('button[type="submit"]');

  /* =========================================
     PASSWORD SHOW / HIDE
  ========================================= */

  function togglePasswordVisibility(input, button) {
    if (!input || !button) return;

    const icon = button.querySelector("i");
    const isPassword = input.type === "password";

    input.type = isPassword ? "text" : "password";

    if (icon) {
      icon.classList.toggle("fa-eye", !isPassword);
      icon.classList.toggle("fa-eye-slash", isPassword);
    }

    button.setAttribute(
      "aria-label",
      isPassword ? "Hide password" : "Show password"
    );
  }

  togglePassword?.addEventListener("click", () => {
    togglePasswordVisibility(passwordInput, togglePassword);
  });

  toggleConfirmPassword?.addEventListener("click", () => {
    togglePasswordVisibility(
      confirmPasswordInput,
      toggleConfirmPassword
    );
  });

  /* =========================================
     VALIDATION REGEX
  ========================================= */

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

  /* =========================================
     SHOW MESSAGE
  ========================================= */

  function showMessage(message, success = false) {
    let box = document.getElementById("signupMessage");

    if (!box) {
      box = document.createElement("p");
      box.id = "signupMessage";
      box.className = "ev-message";
      box.setAttribute("role", "status");
      box.setAttribute("aria-live", "polite");

      form.insertBefore(box, submitButton);
    }

    box.textContent = message;
    box.classList.add("show");
    box.classList.toggle("success", success);
    box.classList.toggle("error", !success);
  }

  function clearMessage() {
    const box = document.getElementById("signupMessage");

    if (box) {
      box.textContent = "";
      box.classList.remove("show", "success", "error");
    }
  }

  /* =========================================
     CLEAR ERRORS WHILE TYPING
  ========================================= */

  [
    nameInput,
    emailInput,
    passwordInput,
    confirmPasswordInput
  ].forEach((input) => {
    input?.addEventListener("input", () => {
      input.style.borderColor = "";
      clearMessage();
    });
  });

  form.querySelectorAll('input[name="role"]').forEach((radio) => {
    radio.addEventListener("change", clearMessage);
  });

  form.querySelector('input[name="terms"]')?.addEventListener(
    "change",
    clearMessage
  );

  /* =========================================
     SIGNUP SUBMIT
  ========================================= */

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessage();

    const terms = form.querySelector('input[name="terms"]');
    const selectedRole = form.querySelector(
      'input[name="role"]:checked'
    );

    /* FULL NAME */

    if (!nameInput || nameInput.value.trim().length < 3) {
      showMessage("Please enter your full name.");
      nameInput?.focus();
      return;
    }

    /* ROLE */

    if (!selectedRole) {
      showMessage("Please select Client or Attorney.");
      form.querySelector('input[name="role"]')?.focus();
      return;
    }

    /* EMAIL */

    const emailValue = emailInput.value.trim().toLowerCase();

    if (!emailRegex.test(emailValue)) {
      showMessage("Please enter a valid email address.");
      emailInput.focus();
      return;
    }

    /* PASSWORD */

    if (!passwordRegex.test(passwordInput.value)) {
      showMessage(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
      );

      passwordInput.focus();
      return;
    }

    /* CONFIRM PASSWORD */

    if (passwordInput.value !== confirmPasswordInput.value) {
      showMessage("Passwords do not match.");
      confirmPasswordInput.focus();
      return;
    }

    /* TERMS AND PRIVACY */

    if (!terms || !terms.checked) {
      showMessage("Please accept the Terms and Privacy Policy.");
      terms?.focus();
      return;
    }

    /* =========================================
       BUTTON LOADING
    ========================================= */

    const originalHTML = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.classList.add("loading");

    submitButton.innerHTML = `
      <span>Creating Account...</span>
      <span class="submit-arrow">
        <i class="fa-solid fa-spinner fa-spin"></i>
      </span>
    `;

    /* =========================================
       DEMO SIGNUP PROCESS
       No account is saved yet.
    ========================================= */

    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.classList.remove("loading");
      submitButton.innerHTML = originalHTML;

      const roleName =
        selectedRole.value === "attorney" ? "Attorney" : "Client";

      showMessage(
        `${roleName} details validated successfully! Connect account storage to complete registration.`,
        true
      );

      // This is a demo only. Do not store passwords in localStorage.
    }, 1000);
  });
});
