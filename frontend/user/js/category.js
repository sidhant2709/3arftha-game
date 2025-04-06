document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
  });

  async function fetchCategories() {
    try {
      const response = await fetch("http://localhost:9090/api/categories/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid API response: Expected an array but received " +
            JSON.stringify(data)
        );
      }

      const parentCategories = data.filter(
        (category) => category.parentCategory === null
      );
      displayCategories(parentCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  function displayCategories(categories) {
    const categoriesContainer = document.querySelector(".newgame_card_slider");
    categoriesContainer.innerHTML = "";

    categories.forEach((category) => {
      const categoryCard = document.createElement("a");
      categoryCard.href = "new_game_subcategory.html";
      categoryCard.classList.add("d-inline-block");
      categoryCard.dataset.categoryId = category._id;

      categoryCard.innerHTML = `
      <div class='category-container' style="width: 250px; border-radius: 20px; overflow: hidden; text-align: center; margin: 15px; position: relative;">
          <img style="width: 100%; height: 300px; object-fit: cover; border-radius: 15px;"
              src="${category.categoryPicture || 'images/thumb/thumb1.png'}"
              alt="${category.name}">
          <h5 style="color: #FFF; text-align: center; font-size: 20px; font-weight: 600;
                    position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
                    padding: 5px 10px; border-radius: 10px; width: 80%;">
              ${category.name}
          </h5>
      </div>
  `;
      categoryCard.addEventListener("click", (event) => {
        event.preventDefault();
        sessionStorage.setItem("selectedCategoryId", category._id);
        window.location.href = "new_game_subcategory.html";
      });

      categoriesContainer.appendChild(categoryCard);
    });
  }
