document.addEventListener("DOMContentLoaded", async () => {
  const gameId = sessionStorage.getItem("gameId");
  const token = sessionStorage.getItem("authToken");
  const apiUrl = `http://localhost:9090/api/games/${gameId}`;

  let stopwatchInterval;
  let isPaused = false;
  let elapsedTime = 0; // Elapsed time in seconds

  const updateStopwatchDisplay = () => {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    document.querySelector(".leaderboard_timer_content .minute").textContent =
      String(minutes).padStart(2, "0");
    document.querySelector(".leaderboard_timer_content .second").textContent =
      String(seconds).padStart(2, "0");
  };

  const startStopwatch = () => {
    stopwatchInterval = setInterval(() => {
      if (!isPaused) {
        elapsedTime++;
        updateStopwatchDisplay();
      }
    }, 1000);
  };

  const resetStopwatch = () => {
    clearInterval(stopwatchInterval);
    elapsedTime = 0;
    updateStopwatchDisplay();
    startStopwatch();
  };

  document.querySelector(".play_pause").addEventListener("click", () => {
    isPaused = !isPaused;
    document
      .querySelector(".play_pause i")
      .classList.toggle("fa-pause", !isPaused);
    document
      .querySelector(".play_pause i")
      .classList.toggle("fa-play", isPaused);
  });

  document.querySelector(".reset").addEventListener("click", resetStopwatch);

  startStopwatch();

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

    const questionIndexElement = document.querySelector(
      ".round_btn #question_no"
    );
    questionIndexElement.textContent = currentQuestionIndex;

    const roundPoints = document.querySelector(".round_points");
    roundPoints.textContent = currrentRound * 10;

    const teamElements = document.querySelectorAll(".lb_left_team_content");

    teams.sort((a, b) => b.score - a.score);
    // Loop through teams and update leaderboard dynamically
    teamElements.forEach((teamElement, index) => {
      if (index < teams.length) {
        teamElement.classList.add("active");
        const teamNameSpan = teamElement.querySelector("span");
        const teamScoreButton = teamElement.querySelector("button");
        teamNameSpan.textContent = teams[index].name;
        teamScoreButton.textContent = teams[index].score || 0;
      } else {
        // teamElement.classList.remove("active");
        teamElement.remove();
      }
    });

    const currentQuestion =
      JSON.parse(sessionStorage.getItem("currentQuestion")) ||
      data.questions[0];

    // Update Question Text
    const questionElement = document.querySelector("#questionText");
    if (questionElement && currentQuestion) {
      questionElement.innerHTML = currentQuestion.content;
    }

    // Update Question Media
    const mediaContainer = document.querySelector(".image-container .logo3");
    const loader = document.createElement("div");
    loader.className = "loader";
    mediaContainer.parentNode.insertBefore(loader, mediaContainer);

    if (mediaContainer && currentQuestion) {
      const mediaUrl = currentQuestion.mediaUrl;
      const fileExtension = mediaUrl.split(".").pop().toLowerCase();
      const questionType = currentQuestion.type.toLowerCase();

      if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) {
        mediaContainer.onload = () => {
          loader.style.display = "none";
          mediaContainer.style.display = "block";
        };
        mediaContainer.onerror = () => {
          loader.style.display = "none";
          mediaContainer.style.display = "none";
          alert("Failed to load image.");
        };
        mediaContainer.src = mediaUrl;
        mediaContainer.alt = "Question Image";
        mediaContainer.style.display = "none";
      } else if (["mp4", "webm", "ogg"].includes(fileExtension)) {
        const videoElement = document.createElement("video");
        videoElement.className = "logo3";
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
        videoElement.src = mediaUrl;
        videoElement.style.display = "none";
        mediaContainer.replaceWith(videoElement);
      } else {
        // Handle unsupported media types
        loader.style.display = "none";
        alert("Unsupported media type.");
      }
    }
  } catch (error) {
    console.error("❌ Error fetching game data:", error);
    alert("Failed to load game data. Please try again.");
    [
      "selectedCategoryId",
      "selectedSubcategoryIds",
      "gameId",
      "currentQuestion",
      "currentRound",
      "currentQuestionIndex",
      "parentCategory",
      "assignedTeam",
      "resultGameId"
    ].forEach((key) => {
      sessionStorage.removeItem(key);
    });
    window.location.href = "my_game.html";
  }
});

// Life Line Support

document.addEventListener("DOMContentLoaded", () => {
  const supportiveList = document.querySelector(".leaderboard_supportive > ul");

  if (supportiveList) {
    // Load the last clicked index from localStorage
    const savedIndex = localStorage.getItem("selectedSupportiveItem");

    // Apply saved opacity if available
    if (savedIndex !== null) {
      const savedItem = supportiveList.children[savedIndex];
      if (savedItem) {
        savedItem.style.opacity = "0.5"; // Keep the last selected item faded
      }
    }

    supportiveList.addEventListener("click", (event) => {
      const clickedItem = event.target.closest("li");

      if (clickedItem) {
        // Find index of clicked item
        const index = Array.from(supportiveList.children).indexOf(clickedItem);

        // If the clicked item is already faded, do nothing
        if (clickedItem.style.opacity === "0.5") return;

        // Store index in localStorage
        localStorage.setItem("selectedSupportiveItem", index);

        // Apply reduced opacity to the clicked item
        clickedItem.style.opacity = "0.5";
      }
    });
  }
});
