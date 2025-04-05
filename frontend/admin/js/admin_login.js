document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("login_button");
  if (loginBtn) {
    loginBtn.addEventListener("click", async function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const errorMsg = document.getElementById("errorMsg");

      // Clear previous error message
      if (errorMsg) {
        errorMsg.style.display = "none";
        errorMsg.innerText = "";
      }

      try {
        const response = await fetch(`${BASE_URL}/auth/login-admin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Invalid credentials");
        }

        // Store the token in sessionStorage
        sessionStorage.setItem("authToken", data.token);
        sessionStorage.setItem("role", data.role);

        // Redirect user to the dashboard
        window.location.href = "manage_questions.html";
      } catch (error) {
        console.error("Login failed:", error);

        if (errorMsg) {
          errorMsg.innerText = error.message;
          errorMsg.style.display = "block";
        }
      }
    });
  }
});
