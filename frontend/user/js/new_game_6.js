document.addEventListener("DOMContentLoaded", async () => {
  const gameId = sessionStorage.getItem("gameId");
  const token = sessionStorage.getItem("authToken");
  const apiUrl = `http://localhost:9090/api/games/${gameId}`;

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

    // Get all team elements in the leaderboard
    const teamElements = document.querySelectorAll(".lb_left_team_content");

    teams.sort((a, b) => b.score - a.score);
    // Loop through teams and update leaderboard dynamically
    teamElements.forEach((teamElement, index) => {
      if (index < teams.length) {
        teamElement.classList.add("active"); // ✅ Add "active" class to available teams
        const teamNameSpan = teamElement.querySelector("span");
        const teamScoreButton = teamElement.querySelector("button");

        // ✅ Set the team name & score
        teamNameSpan.textContent = teams[index].name;
        teamScoreButton.textContent = teams[index].score || 0;
      } else {
        // ✅ Remove "active" class for extra slots
        // teamElement.classList.remove("active");
        teamElement.remove();
      }
    });

    const currentQuestion =
      JSON.parse(sessionStorage.getItem("currentQuestion")) ||
      data.questions[0];

    // Update Answer Text
    const answerElement = document.querySelector("#answerText");
    if (answerElement && currentQuestion) {
      answerElement.innerHTML = currentQuestion.correctAnswer;
    }

    // Update answerMedia
    const answerMediaContainer = document.querySelector(".image-container .thumb4");
    const loader = document.createElement("div");
    loader.className = "loader";
    answerMediaContainer.parentNode.insertBefore(loader, answerMediaContainer);

    if (answerMediaContainer && currentQuestion) {
      const answerMediaUrl = currentQuestion.answerMediaUrl;
      const fileExtension = answerMediaUrl.split('.').pop().toLowerCase();
      const questionType = currentQuestion.type.toLowerCase();

      if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) {
        answerMediaContainer.onload = () => {
          loader.style.display = "none";
          answerMediaContainer.style.display = "block";
        };
        answerMediaContainer.onerror = () => {
          loader.style.display = "none";
          answerMediaContainer.style.display = "none";
          alert("Failed to load image.");
        };
        answerMediaContainer.src = answerMediaUrl;
        answerMediaContainer.alt = "Answer Image";
        answerMediaContainer.style.display = "none";
      } else if (["mp4", "webm", "ogg"].includes(fileExtension)) {
        const videoElement = document.createElement("video");
        videoElement.className = "thumb4";
        videoElement.controls = true;
        videoElement.onloadeddata = () => {
          loader.style.display = "none";
          videoElement.style.display = "block";
        };
        videoElement.onerror = () => {
          loader.style.display = "none";
          videoElement.style.display = "none";
          alert("Failed to load video.");
        };
        videoElement.src = answerMediaUrl;
        videoElement.style.display = "none";
        answerMediaContainer.replaceWith(videoElement);
      } else {
        // Handle unsupported media types
        loader.style.display = "none";
        alert("Unsupported media type.");
      }
    }
  } catch (error) {
    console.error("❌ Error fetching game data:", error);
    alert("Failed to load game data. Please try again.");
  }
});
