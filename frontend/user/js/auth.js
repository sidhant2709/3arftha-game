document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register_form");
  if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent default form submission

      const formData = new FormData(event.target);

      const dob = formData.get("dob");
      const dateObj = new Date(dob);
      const formattedDob = `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`;
      formData.set("dob", formattedDob);
      try {
        const response = await fetch(
          "http://localhost:9090/api/users/register",
          {
            method: "POST",
            body: formData,
          }
        );
        const result = await response.json();
        if (!response.ok) {
          console.error("API Error:", result);
        }
        alert("User registered successfully!");
        window.location.href = "login.html";
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to register user.");
      }
    });
  }


  const loginBtn = document.getElementById("loginBtn");
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
        const response = await fetch("http://localhost:9090/api/users/login", {
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
        sessionStorage.setItem("userId", data.userId);

        // Redirect user to the dashboard
        window.location.href = "my_game.html";
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