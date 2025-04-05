document.addEventListener("DOMContentLoaded", function () {
  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("authToken");
  const apiUrl = `${BASE_URL}/questions`;

  const categorySelect = document.getElementById("q-category");
  const subCategorySelect = document.getElementById("q-sub-category");
  const form = document.querySelector(".add-question-wrapper form");

  let fileNameQuestionSpan = document.getElementById("question-file-media");
  let fileNameAnswerSpan = document.getElementById("answer-file-media");


  subCategorySelect.innerHTML = `<option value="" disabled selected>Select a sub category</option>`;

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

  document
    .getElementById("question-file")
    .addEventListener("change", (event) => {
      const fileInput = event.target;
      if (fileInput.files.length > 0) {
        fileNameQuestionSpan.textContent = fileInput.files[0].name;
      } else {
        fileNameQuestionSpan.textContent = "No file selected";
      }
    });

    document
    .getElementById("answer-file")
    .addEventListener("change", (event) => {
      const fileInput = event.target;
      if (fileInput.files.length > 0) {
        fileNameAnswerSpan.textContent = fileInput.files[0].name;
      } else {
        fileNameAnswerSpan.textContent = "No file selected";
      }
    });

  // Handle form submission
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = document.getElementById("Question").value;
    const answer = document.getElementById("answer").value;
    const subCategory = subCategorySelect.value;

    const formData = new FormData();
    formData.append("category", subCategory);
    formData.append("content", question);
    formData.append("correctAnswer", answer);

    const mediaFile = document.getElementById("question-file").files[0];
    if (mediaFile) {
      const fileExtension = mediaFile.name.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) {
        formData.append("type", "image");
      } else if (["mp4", "webm", "ogg"].includes(fileExtension)) {
        formData.append("type", "video");
      } else {
        alert("Unsupported file type. Please upload an image or video.");
        return;
      }
      formData.append("media", mediaFile);
    }

    const answerMediaFile = document.getElementById("answer-file").files[0];
    if (answerMediaFile) {
      formData.append("answerMedia", answerMediaFile);
    }

    if (!question || !answer || !subCategory) {
      alert("Please fill in all fields.");
      return;
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
        fileNameQuestionSpan.textContent = "";
        fileNameAnswerSpan.textContent = "";
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

  document
    .getElementById("cancel-button-add-question")
    .addEventListener("click", (event) => {
      event.preventDefault();
      fileNameQuestionSpan.textContent = "";
      fileNameAnswerSpan.textContent = "";
      form.reset();
    });

  // Initialize categories on page load
  fetchCategories();
});