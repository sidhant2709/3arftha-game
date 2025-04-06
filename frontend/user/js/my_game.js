document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("button[data-game-id]");
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const gameId = button.getAttribute("data-game-id"); // Get the game ID from the button
        // Store the gameId and endpoint in sessionStorage (optional)
        sessionStorage.setItem("gameId", gameId);
        // Navigate to new_game_5.html with gameId as a query parameter
        window.location.href = `new_game_question.html?gameId=${gameId}`;
      });
    });
  });