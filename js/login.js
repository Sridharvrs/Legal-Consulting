
document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  // ELEMENTS
  // ========================================
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const passwordToggle = document.getElementById("pwdToggle");
  const loginError = document.getElementById("loginError");
  const btnText = document.getElementById("btnText");
  const rememberCheckbox = document.getElementById("remember");
  const emailLabel = document.getElementById("emailLabel");
  const roleCards = document.querySelectorAll("#lm .role-card");

  if (!loginForm) {
    console.error("Login form not found. Check the ID: loginForm");
    return;
  }

  const submitButton = loginForm.querySelector(
    'button[type="submit"], input[type="submit"]'
  );

  let selectedRole = "client";

  // ========================================
  // DASHBOARD ROUTES
  // ========================================
  const dashboardRoutes = {
    client: "./client-dashboard.html",
    attorney: "./attorney-dashboard.html"
  };

  // ========================================
  // VALIDATION
  // ========================================
  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function validatePassword(value) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/.test(
      value
    );
  }

  function showError(message) {
    if (loginError) {
      loginError.textContent = message;
      loginError.style.display = "block";
    } else {
      alert(message);
    }
  }

  function clearError() {
    if (loginError) {
      loginError.textContent = "";
      loginError.style.display = "none";
    }
  }

  // ========================================
  // ROLE SELECTION
  // ========================================
  function selectRole(role) {
    if (!dashboardRoutes[role]) return;

    selectedRole = role;

    roleCards.forEach((card) => {
      const isSelected = card.dataset.role === role;

      card.classList.toggle("active", isSelected);
      card.classList.toggle("on", isSelected);
      card.setAttribute("aria-pressed", String(isSelected));
    });

    if (btnText) {
      btnText.textContent =
        role === "attorney" ? "Attorney Login" : "Client Login";
    }

    if (emailLabel) {
      emailLabel.textContent =
        role === "attorney" ? "Attorney Email" : "Client Email";
    }

    emailInput.placeholder =
      role === "attorney"
        ? "Enter your attorney email"
        : "Enter your client email";

    clearError();
  }

  roleCards.forEach((card) => {
    card.addEventListener("click", () => {
      selectRole(card.dataset.role);
    });
  });

  // ========================================
  // SHOW / HIDE PASSWORD
  // ========================================
  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener("click", () => {
      const showPassword = passwordInput.type === "password";

      passwordInput.type = showPassword ? "text" : "password";

      const icon = passwordToggle.querySelector("i");

      if (icon) {
        icon.classList.toggle("fa-eye", !showPassword);
        icon.classList.toggle("fa-eye-slash", showPassword);
      }

      passwordToggle.setAttribute(
        "aria-label",
        showPassword ? "Hide password" : "Show password"
      );
    });
  }

  // ========================================
  // CLEAR ERRORS WHILE TYPING
  // ========================================
  [emailInput, passwordInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", clearError);
    }
  });

  // ========================================
  // LOGIN FORM
  // ========================================
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;

    // Validate email
    if (!emailValue) {
      showError("Please enter your email address.");
      emailInput.focus();
      return;
    }

    if (!validateEmail(emailValue)) {
      showError("Please enter a valid email address.");
      emailInput.focus();
      return;
    }

    // Validate password
    if (!passwordValue) {
      showError("Please enter your password.");
      passwordInput.focus();
      return;
    }

    if (!validatePassword(passwordValue)) {
      showError(
        "Password must contain at least 8 characters, including uppercase, lowercase, a number, and a special character."
      );
      passwordInput.focus();
      return;
    }

    // Validate role and destination
    const dashboard = dashboardRoutes[selectedRole];

    if (!dashboard) {
      showError("Please select Client or Attorney.");
      return;
    }

    // Store demo login session
    const currentUser = {
      name: emailValue.split("@")[0],
      email: emailValue,
      role: selectedRole
    };

    try {
      // Clear an older demo session
      localStorage.removeItem("stacklyCurrentUser");
      sessionStorage.removeItem("stacklyCurrentUser");

      if (rememberCheckbox && rememberCheckbox.checked) {
        localStorage.setItem(
          "stacklyCurrentUser",
          JSON.stringify(currentUser)
        );
      } else {
        sessionStorage.setItem(
          "stacklyCurrentUser",
          JSON.stringify(currentUser)
        );
      }
    } catch (error) {
      console.error("Unable to save login session:", error);
      showError("Unable to save your session. Please check browser storage.");
      return;
    }

    // Show loading state
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add("loading");
    }

    if (btnText) {
      btnText.textContent = "Signing in...";
    }

    // Redirect to the selected dashboard
    window.location.assign(dashboard);
  });

  // ========================================
  // INITIALIZE
  // ========================================
  selectRole("client");
});
