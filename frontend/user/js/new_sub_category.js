document.addEventListener("DOMContentLoaded", () => {
  fetchSubcategories();
});

let selectedSubcategoryIds =
  JSON.parse(sessionStorage.getItem("selectedSubcategoryIds")) || [];

async function fetchSubcategories() {
  const selectedCategoryId = sessionStorage.getItem("selectedCategoryId");

  if (!selectedCategoryId) {
    console.error("No category selected!");
    return;
  }

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

    const subcategories = data.filter(
      (category) =>
        category.parentCategory &&
        category.parentCategory._id === selectedCategoryId
    );
    displaySubcategories(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
  }
}

function displaySubcategories(subcategories) {
  const subcategoriesContainer = document.querySelector(
    ".newgame_card_slider.newgame_2"
  );
  subcategoriesContainer.innerHTML = ""; // Clear existing content

  subcategories.forEach((subcategory) => {
    const subcategoryCard = document.createElement("a");
    subcategoryCard.href = "#";
    subcategoryCard.classList.add("d-inline-block");

    subcategoryCard.innerHTML = `
          <div class='category-container' style="width: 250px; border-radius: 20px; overflow: hidden; text-align: center; margin: 15px; position: relative;">
              <img style="width: 100%; height: 300px; object-fit: cover; border-radius: 15px;"
                  src="${
                    subcategory.categoryPicture || "images/thumb/thumb1.png"
                  }"
                  alt="${subcategory.name}">
              <h5 style="color: #FFF; text-align: center; font-size: 20px; font-weight: 600;
                      position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
                      padding: 5px 10px; border-radius: 10px; width: 80%;">
                  ${subcategory.name}
              </h5>
          </div>`;

    if (selectedSubcategoryIds.includes(subcategory._id)) {
      subcategoryCard.classList.add("selected");
    }
    subcategoryCard.addEventListener("click", (event) => {
      event.preventDefault();
      if (selectedSubcategoryIds.includes(subcategory._id)) {
        selectedSubcategoryIds = selectedSubcategoryIds.filter(
          (id) => id !== subcategory._id
        );
        subcategoryCard.classList.remove("selected");
      } else {
        selectedSubcategoryIds.push(subcategory._id);
        subcategoryCard.classList.add("selected");
      }
    });

    subcategoriesContainer.appendChild(subcategoryCard);
  });

  const subCategoryNextButton = document.querySelector("#sub_category_next_button");

  subCategoryNextButton.addEventListener("click", async (event) => {
    event.preventDefault();

    if (selectedSubcategoryIds.length < 2) {
      alert("Please select at least 2 subcategories.");
      return;
    }

    sessionStorage.setItem("selectedSubcategoryIds", JSON.stringify(selectedSubcategoryIds));
    window.location.href = "new_game_teams.html";
  });
}
