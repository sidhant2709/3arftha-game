document.addEventListener("DOMContentLoaded", async () => {
  const gameId = sessionStorage.getItem("gameId");
  const token = sessionStorage.getItem("authToken");
  const apiUrl = `http://localhost:9090/api/games/${gameId}`;
  const subCategoryId = JSON.parse(sessionStorage.getItem("selectedSubcategoryIds")) || [];
  const assignedTeam = JSON.parse(sessionStorage.getItem("assignedTeam"));
  const parentCategory = sessionStorage.getItem("parentCategory");
  const currrentRound = sessionStorage.getItem("currentRound");
  const currentQuestionIndex = sessionStorage.getItem("currentQuestionIndex");

  const teamRoleElement = document.querySelector("#teamRole span");
  teamRoleElement.textContent = assignedTeam.name;

  const categoryElement = document.querySelector("#category a");
  categoryElement.textContent = parentCategory;

  const roundElement = document.querySelector(".round_btn #round");
  roundElement.textContent = currrentRound;

  const questionIndexElement = document.querySelector(".round_btn #question_no");
  questionIndexElement.textContent = currentQuestionIndex;

  const roundPoints = document.querySelector(".round_points");
  roundPoints.textContent = currrentRound * 10

  const fetchData = async (url, options) => {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Failed to fetch data.");
    }
    return response.json();
  };

  const submitAnswer = async (payload) => {
    const submitResponse = await fetch("http://localhost:9090/api/games/submit-answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!submitResponse.ok) {
      throw new Error("Failed to submit answer.");
    }
  };

  const startNextQuestion = async (userId, subCategoryId, teams) => {
    const startResponse = await fetch(`http://localhost:9090/api/games/${userId}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        subcategories: subCategoryId,
        teams: teams,
      }),
    });

    if (!startResponse.ok) {
      throw new Error("Failed to start the next question.");
    }

    const startResult = await startResponse.json();
    sessionStorage.setItem("gameId", startResult.gameId);
    sessionStorage.setItem("currentQuestion", JSON.stringify(startResult.question));
    sessionStorage.setItem("currentRound", startResult.currentRound);
    sessionStorage.setItem("currentQuestionIndex", startResult.currentQuestionIndex);
    sessionStorage.setItem("parentCategory", startResult.parentCategory);
    sessionStorage.setItem("assignedTeam", JSON.stringify(startResult.assignedTeam));

    if (startResult.gameId) {
      window.location.href = "new_game%20_5.html";
    } else {
      sessionStorage.removeItem("gameId");
      sessionStorage.removeItem("currentQuestion");
      sessionStorage.removeItem("selectedCategoryId");
      sessionStorage.removeItem("selectedSubcategoryIds");
      sessionStorage.removeItem("currentRound");
      sessionStorage.removeItem("currentQuestionIndex");
      sessionStorage.removeItem("parentCategory");
      sessionStorage.removeItem("assignedTeam");
      window.location.href = "new_game%20_8.html";
    }
  };

  try {
    const data = await fetchData(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const teams = data.teams;
    const leftList = document.querySelector(".lbm_allteam_wrapper ul:first-of-type");
    const rightList = document.querySelector(".lbm_allteam_wrapper ul:last-of-type");

    leftList.innerHTML = "";
    rightList.innerHTML = "";

    teams.forEach((team, index) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = team.name;
      listItem.appendChild(link);

      if (index % 2 === 0) {
        leftList.appendChild(listItem);
      } else {
        rightList.appendChild(listItem);
      }

      link.addEventListener("click", async (event) => {
        event.preventDefault();
        const userId = sessionStorage.getItem("userId");
        const payload = {
          userId: userId,
          gameId: gameId,
          teamId: team._id,
        };

        try {
          await submitAnswer(payload);
          await startNextQuestion(userId, subCategoryId, teams);
        } catch (error) {
          alert(error.message);
        }
      });
    });
  } catch (error) {
    alert(error.message);
  }
});