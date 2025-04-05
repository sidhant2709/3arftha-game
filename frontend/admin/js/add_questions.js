document.addEventListener("DOMContentLoaded", function () {
  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("authToken");
  const apiUrl = `${BASE_URL}/questions`;

  const categorySelect = document.getElementById("q-category");
  const subCategorySelect = document.getElementById("q-sub-category");
  const form = document.querySelector(".add-question-wrapper form");

  subCategorySelect.innerHTML = `<option value="" disabled selected>Select a sub category</option>`; // Add placeholder option

  // Fetch categories
  async function fetchCategories() {
    try {
      const response = await fetch(`${BASE_URL}/categories/allCategories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const categories = await response.json();
      categorySelect.innerHTML = `<option value="" disabled selected>Select a category</option>` + // Add placeholder option
        categories.data
          .map((category) => `<option value="${category._id}">${category.name}</option>`)
          .join("");
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  // Fetch subcategories based on selected category
  async function fetchSubCategories(categoryId) {
    try {
      const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      subCategorySelect.innerHTML = `<option value="" disabled selected>Select a sub category</option>` +
        data.subcategories
          .map((subCategory) => `<option value="${subCategory._id}">${subCategory.name}</option>`)
          .join("");
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  }

  // Handle category change
  categorySelect.addEventListener("change", (event) => {
    const selectedCategoryId = event.target.value;
    fetchSubCategories(selectedCategoryId);
  });

  // Handle form submission
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("category", subCategorySelect.value);
    formData.append("content", document.getElementById("Question").value);
    formData.append("correctAnswer", document.getElementById("answer").value);
    formData.append("type", "image");

    const mediaFile = document.getElementById("question-file").files[0];
    if (mediaFile) {
      formData.append("media", mediaFile);
    }

    const answerMediaFile = document.getElementById("answer-file").files[0];
    if (answerMediaFile) {
      formData.append("answerMedia", answerMediaFile);
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Question added successfully!");
        form.reset();
      } else {
        const errorData = await response.json();
        console.error("Error adding question:", errorData);
        alert("Failed to add question.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  });

  // Initialize categories on page load
  fetchCategories();
});