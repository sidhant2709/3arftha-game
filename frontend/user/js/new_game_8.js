document.addEventListener("DOMContentLoaded", async () => {
  const gameId = sessionStorage.getItem("resultGameId");
  const token = sessionStorage.getItem("authToken");
  const apiUrl = `http://localhost:9090/api/games/${gameId}/leaderBoard`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    const teams = data.teams;

    // Find the team with the highest score
    let winningTeam = teams[0];
    for (let i = 1; i < teams.length; i++) {
      if (teams[i].score > winningTeam.score) {
        winningTeam = teams[i];
      }
    }

    const winnerNameElement = document.querySelector(".winner_team_content h3");
    if (winnerNameElement) {
      winnerNameElement.textContent = winningTeam.name;
    }

    const backToBoardButton = document.getElementById("back_to_board");

    if (backToBoardButton) {
      backToBoardButton.addEventListener("click", () => {
        sessionStorage.removeItem("resultGameId");
      });
    }

    const leaderboardContent = document.querySelector(".winnerteam_list_content");
    if (leaderboardContent) {
        leaderboardContent.innerHTML = ''; // Clear existing content
        teams.forEach(team => {
            const teamElement = document.createElement("div");
            teamElement.classList.add("winnerteam_list");
            if (team.name === winningTeam.name) {
                teamElement.classList.add("active");
            }
            teamElement.innerHTML = `
                <span>${team.name}</span>
                <button type="button" class="${team.name === winningTeam.name ? 'winner' : ''}">
                    ${team.score}
                    ${team.name === winningTeam.name ? '<img src="images/vector/vector53.png" alt="">' : ''}
                </button>
            `;
            leaderboardContent.appendChild(teamElement);
        });
    }
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
  }
});
