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

    if (currrentRound !== "1") {
      const lastRound = sessionStorage.getItem("lastRound");

      if (lastRound !== currrentRound) {
        // Store the current round as the last displayed round
        sessionStorage.setItem("lastRound", currrentRound);

        const announcement = document.createElement("div");
        announcement.className = "round-announcement";
        announcement.textContent = `Round ${currrentRound} Begins!`;
        document.body.appendChild(announcement);

        // Add animation styles
        announcement.style.position = "fixed";
        announcement.style.top = "50%";
        announcement.style.left = "50%";
        announcement.style.width = "100%";
        announcement.style.transform = "translateY(-50%)";
        announcement.style.padding = "20px 40px";
        announcement.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        announcement.style.color = "#fff";
        announcement.style.fontSize = "5rem";
        announcement.style.borderRadius = "10px";
        announcement.style.textAlign = "center";
        announcement.style.zIndex = "1000";
        announcement.style.opacity = "0";
        announcement.style.transition =
          "opacity 0.5s ease, transform 0.5s ease";
        // Trigger animation
        setTimeout(() => {
          announcement.style.opacity = "1";
          announcement.style.transform = "translate(-50%, -50%) scale(1.1)";
        }, 100);

        // Trigger confetti animation
        setTimeout(() => {
          triggerConfetti(announcement); // Pass the announcement div as the container
        }, 100);

        // Remove announcement after animation
        setTimeout(() => {
          announcement.style.opacity = "0";
          announcement.style.transform = "translate(-50%, -50%) scale(1)";
          setTimeout(() => {
            announcement.remove();
          }, 500);
        }, 3000);
      }
    }

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
      "resultGameId",
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

function triggerConfetti(container) {
  var random = Math.random,
    cos = Math.cos,
    sin = Math.sin,
    PI = Math.PI,
    PI2 = PI * 2,
    timer = undefined,
    frame = undefined,
    confetti = [];

  var spread = 50, // Reduced interval between confetti creation
    sizeMin = 6,
    sizeMax = 16,
    eccentricity = 10,
    deviation = 100,
    dxThetaMin = -0.2, // Increased horizontal speed
    dxThetaMax = 0.2, // Increased horizontal speed
    dyMin = 0.2, // Increased vertical speed
    dyMax = 0.4, // Increased vertical speed
    dThetaMin = 0.5, // Increased rotation speed
    dThetaMax = 1.0; // Increased rotation speed

  var colorThemes = [
    function () {
      var colors = ["#EF5350", "#EC407A","#AB47BC","#7E57C2","#5C6BC0","#42A5F5","#29B6F6","#26C6DA","#26A69A","#66BB6A","#9CCC65","#D4E157","#FFEE58","#FFCA28","#FFA726","#FF7043","#8D6E63","#BDBDBD","#78909C"];
      return colors[Math.floor(Math.random() * colors.length)];
    },
  ];

  function color(r, g, b) {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function interpolation(a, b, t) {
    return ((1 - cos(PI * t)) / 2) * (b - a) + a;
  }

  var radius = 1 / eccentricity,
    radius2 = radius + radius;

  function createPoisson() {
    var domain = [radius, 1 - radius],
      measure = 1 - radius2,
      spline = [0, 1];
    while (measure) {
      var dart = measure * random(),
        i,
        l,
        interval,
        a,
        b,
        c,
        d;

      for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
        a = domain[i];
        b = domain[i + 1];
        interval = b - a;
        if (dart < measure + interval) {
          spline.push((dart += a - measure));
          break;
        }
        measure += interval;
      }
      c = dart - radius;
      d = dart + radius;

      for (i = domain.length - 1; i > 0; i -= 2) {
        l = i - 1;
        a = domain[l];
        b = domain[i];
        if (a >= c && a < d) if (b > d) domain[l] = d;
        else domain.splice(l, 2);
        else if (a < c && b > c) if (b <= d) domain[i] = c;
        else domain.splice(i, 0, c, d);
      }

      for (i = 0, l = domain.length, measure = 0; i < l; i += 2) measure += domain[i + 1] - domain[i];
    }

    return spline.sort();
  }

  function Confetto(theme, container) {
    this.frame = 0;
    this.outer = document.createElement('div');
    this.inner = document.createElement('div');
    this.outer.appendChild(this.inner);

    var outerStyle = this.outer.style,
      innerStyle = this.inner.style;
    outerStyle.position = 'absolute';
    outerStyle.width = sizeMin + sizeMax * random() + 'px';
    outerStyle.height = sizeMin + sizeMax * random() + 'px';
    innerStyle.width = '100%';
    innerStyle.height = '100%';
    innerStyle.backgroundColor = theme();

    outerStyle.perspective = '50px';
    outerStyle.transform = 'rotate(' + 360 * random() + 'deg)';
    this.axis =
      'rotate3D(' + cos(360 * random()) + ',' + cos(360 * random()) + ',0,';
    this.theta = 360 * random();
    this.dTheta = dThetaMin + dThetaMax * random();
    innerStyle.transform = this.axis + this.theta + 'deg)';

    const rect = container.getBoundingClientRect();
    this.x = rect.width * random();
    this.y = -deviation;
    this.dx = sin(dxThetaMin + dxThetaMax * random());
    this.dy = dyMin + dyMax * random();
    outerStyle.left = this.x + 'px';
    outerStyle.top = this.y + 'px';

    this.splineX = createPoisson();
    this.splineY = [];
    for (var i = 1, l = this.splineX.length - 1; i < l; ++i)
      this.splineY[i] = deviation * random();
    this.splineY[0] = this.splineY[l] = deviation * random();

    this.update = function (height, delta) {
      this.frame += delta;
      this.x += this.dx * delta;
      this.y += this.dy * delta;
      this.theta += this.dTheta * delta;

      var phi = (this.frame % 7777) / 7777,
        i = 0,
        j = 1;
      while (phi >= this.splineX[j]) i = j++;
      var rho = interpolation(
        this.splineY[i],
        this.splineY[j],
        (phi - this.splineX[i]) / (this.splineX[j] - this.splineX[i])
      );
      phi *= PI2;

      outerStyle.left = this.x + rho * cos(phi) + 'px';
      outerStyle.top = this.y + rho * sin(phi) + 'px';
      innerStyle.transform = this.axis + this.theta + 'deg)';
      return this.y > height + deviation;
    };
  }

  function poof() {
    if (!frame) {
      if (!container) return;

      var animationContainer = document.createElement('div');
      animationContainer.style.position = 'absolute';
      animationContainer.style.top = '0';
      animationContainer.style.left = '0';
      animationContainer.style.width = '100%';
      animationContainer.style.height = '100%';
      animationContainer.style.overflow = 'visible';
      animationContainer.style.pointerEvents = 'none';
      container.appendChild(animationContainer);

      var theme = colorThemes[0];
      (function addConfetto() {
        var confetto = new Confetto(theme, container);
        confetti.push(confetto);
        animationContainer.appendChild(confetto.outer);
        timer = setTimeout(addConfetto, spread * random());
      })();

      var prev = undefined;
      requestAnimationFrame(function loop(timestamp) {
        var delta = prev ? timestamp - prev : 0;
        prev = timestamp;
        var height = container.clientHeight;

        for (var i = confetti.length - 1; i >= 0; --i) {
          if (confetti[i].update(height, delta)) {
            animationContainer.removeChild(confetti[i].outer);
            confetti.splice(i, 1);
          }
        }

        if (timer || confetti.length) return (frame = requestAnimationFrame(loop));

        container.removeChild(animationContainer);
        frame = undefined;
      });
    }
  }

  poof();
}