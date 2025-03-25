document.addEventListener("DOMContentLoaded", function () {
  const role = sessionStorage.getItem("rolw");
  const token = sessionStorage.getItem("authToken");
  const apiUrl = `${BASE_URL}/questions`;
  const tableBody = document.querySelector("tbody");
  const totalQuestionButton = document.querySelector(".total-question-btn small");

  const getQuestions = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      totalQuestionButton.textContent = data.length;
      renderTable(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const renderTable = (questions) => {
    tableBody.innerHTML = ""; // Clear existing rows
    questions.forEach((question) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${question._id}</td>
        <td>${question.content}</td>
        <td>${question.correctAnswer}</td>
        <td>${question.category.name}</td>
        <td>${question.category.name}</td>
        <td>
          <span>${question.type}</span>
        </td>
        <td>
          <span class="table-icon">
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.23181 14.9821V18.1071H6.35681L15.5735 8.89047L12.4485 5.76547L3.23181 14.9821ZM17.9901 6.47381C18.0674 6.39671 18.1287 6.30514 18.1705 6.20433C18.2123 6.10352 18.2338 5.99545 18.2338 5.88631C18.2338 5.77717 18.2123 5.6691 18.1705 5.56829C18.1287 5.46747 18.0674 5.3759 17.9901 5.29881L16.0401 3.34881C15.9631 3.27155 15.8715 3.21026 15.7707 3.16845C15.6699 3.12663 15.5618 3.1051 15.4526 3.1051C15.3435 3.1051 15.2354 3.12663 15.1346 3.16845C15.0338 3.21026 14.9422 3.27155 14.8651 3.34881L13.3401 4.87381L16.4651 7.99881L17.9901 6.47381Z" fill="#808182" />
            </svg>
          </span>
          <span class="table-icon">
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.56519 18.1071C6.10685 18.1071 5.71463 17.9441 5.38852 17.618C5.06241 17.2919 4.89907 16.8994 4.89852 16.4405V5.60715H4.06519V3.94048H8.23185V3.10715H13.2319V3.94048H17.3985V5.60715H16.5652V16.4405C16.5652 16.8988 16.4021 17.2913 16.076 17.618C15.7499 17.9446 15.3574 18.1077 14.8985 18.1071H6.56519ZM8.23185 14.7738H9.89852V7.27381H8.23185V14.7738ZM11.5652 14.7738H13.2319V7.27381H11.5652V14.7738Z" fill="#808182" />
            </svg>
          </span>
        </td>
      `;

      tableBody.appendChild(row);
    });
  };

  getQuestions();
});