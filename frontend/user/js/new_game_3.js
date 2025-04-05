const startGameButton = document.getElementById("startGame");

startGameButton.addEventListener("click", async function () {
  // Get userId, subCategoryId & auth token from sessionStorage
  const userId = sessionStorage.getItem("userId");
  const subCategoryId =
    JSON.parse(sessionStorage.getItem("selectedSubcategoryIds")) || [];
  const authToken = sessionStorage.getItem("authToken");

  try {
    if (!userId || !subCategoryId || !authToken) {
      alert("user id or auth token or subcategory id missing");
      return;
    }

    // Get all teams from the form
    const teams = [];
    document
      .querySelectorAll(".newgame3_first_team")
      .forEach((teamElement, index) => {
        const teamNameInput = teamElement.querySelector("input[type='text']");
        const participantCountInput = teamElement.querySelector(
          ".newgame3_increase_decrease input"
        );

        if (teamNameInput && participantCountInput) {
          teams.push({
            name: teamNameInput.value.trim(),
            participantCount: parseInt(participantCountInput.value, 10) || 0,
          });
        }
      });

    // Prepare request body
    const requestBody = {
      subcategories: subCategoryId,
      teams: teams,
    };

    // Send POST request
    const response = await fetch(
      `http://localhost:9090/api/games/${userId}/start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const result = await response.json();
    if (response.ok) {
      sessionStorage.setItem("gameId", result.gameId);
      sessionStorage.setItem("resultGameId", result.gameId);
      sessionStorage.setItem("currentRound", result.currentRound);
      sessionStorage.setItem("currentQuestionIndex", result.currentQuestionIndex);
      sessionStorage.setItem("parentCategory", result.parentCategory);
      sessionStorage.setItem("assignedTeam", JSON.stringify(result.assignedTeam));
      window.location.href = "new_game%20_5.html";
    } else {
      console.error("Error from API:", result);
      alert(result.message || "Failed to start game.");
      sessionStorage.removeItem("selectedCategoryId");
      sessionStorage.removeItem("selectedSubcategoryIds");
      window.location.href = "my_game.html";
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("An error occurred. Please try again.");
    sessionStorage.removeItem("selectedCategoryId");
    sessionStorage.removeItem("selectedSubcategoryIds");
    window.location.href = "my_game.html";
  }
});

//  Team Selection here
document.addEventListener("DOMContentLoaded", function () {
  const teamSelectionLinks = document.querySelectorAll(
    ".newgame3_card_pagination ul li a"
  );
  const teamWrapper = document.querySelector(".newgame3_team_wrapper .row");

  teamSelectionLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      // Remove active class from all links and add to the clicked one
      teamSelectionLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");

      // Get the selected number of teams
      const selectedTeams = parseInt(this.textContent.trim(), 10);

      // Clear the existing teams
      teamWrapper.innerHTML = "";

      // Generate team input fields
      for (let i = 1; i <= selectedTeams; i++) {
        const col = document.createElement("div");
        col.classList.add("col-lg-6");
        col.innerHTML = `
                      <div class="newgame3_first_team borderleft">
                          <h3>Teams ${i}</h3>
                          <div class="newgame3_firstteam_form">
                              <input type="text" placeholder="Team Name">
                              <div class="newgame3_increase_decrease">
                                  <button type="button" class="decrease">-</button>
                                  <input type="text" value="0" class="team-score">
                                  <button type="button" class="increase">+</button>
                              </div>
                          </div>
                      </div>
                  `;
        teamWrapper.appendChild(col);
      }
    });
  });

  // Event delegation for increment and decrement buttons
  teamWrapper.addEventListener("click", function (event) {
    if (event.target.classList.contains("increase")) {
      let input = event.target.previousElementSibling;
      input.value = parseInt(input.value) + 1;
    }
    if (event.target.classList.contains("decrease")) {
      let input = event.target.nextElementSibling;
      if (parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 1;
      }
    }
  });
});
