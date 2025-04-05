document.addEventListener("DOMContentLoaded", function () {
  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("authToken");

  const categorySelectForSubcategories = document.getElementById("q-category");

  const categorySelectForDelete = document.getElementById("q-category-delete");
  const subCategorySelectForDelete = document.getElementById(
    "q-sub-category-delete"
  );
  subCategorySelectForDelete.disabled = true;

  const deleteCategoriesform = document.querySelector("#delete-category-form");
  const deleteSubCategoriesform = document.querySelector(
    "#delete-sub-category-form"
  );

  const addSubCategoriesform = document.querySelector("#add-sub-category-form");
  const addCategoriesForm = document.querySelector("#add-category-form");

  async function fetchCategories() {
    try {
      const response = await fetch(`${BASE_URL}/categories/allCategories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const categories = await response.json();
      categorySelectForSubcategories.innerHTML =
        `<option value="" disabled selected>Select a Parent category</option>` +
        categories.data
          .map(
            (category) =>
              `<option value="${category._id}">${category.name}</option>`
          )
          .join("");
      categorySelectForDelete.innerHTML =
        `<option value="" disabled selected>Select a category to Delete</option>` +
        categories.data
          .map(
            (category) =>
              `<option value="${category._id}">${category.name}</option>`
          )
          .join("");
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async function fetchSubCategoriesForDelete(categoryId) {
    try {
      const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      subCategorySelectForDelete.innerHTML =
        `<option value="" disabled selected>Select a sub category for Delete</option>` +
        data.subcategories
          .map(
            (subCategory) =>
              `<option value="${subCategory._id}">${subCategory.name}</option>`
          )
          .join("");
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  }

  categorySelectForDelete.addEventListener("change", async (event) => {
    const selectedCategoryId = event.target.value;
    subCategorySelectForDelete.disabled = true;
    await fetchSubCategoriesForDelete(selectedCategoryId);
    subCategorySelectForDelete.disabled = false;
  });

  // =================================================Delete subcategory=================================================

  deleteSubCategoriesform.addEventListener("submit", async (event) => {
    event.preventDefault();
    const selectedCategoryId = categorySelectForDelete.value;
    const selectedSubCategoryId = subCategorySelectForDelete.value;

    if (!selectedCategoryId || !selectedSubCategoryId) {
      alert("Please select a category and a subcategory to delete.");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/categories/${selectedSubCategoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Subcategory deleted successfully!");
        deleteSubCategoriesform.reset();
        fetchSubCategoriesForDelete(selectedCategoryId);
      } else {
        const errorData = await response.json();
        console.error("Error while deleting the subcategory:", errorData);
        alert("Failed to delete the subcategory.");
      }
    } catch (error) {
      console.error("Error while deleting the subcategory:", error);
      alert("An error occurred while deleting the subcategory.");
    }
  });

  document
    .getElementById("cancel-delete-sub-category")
    .addEventListener("click", (event) => {
      event.preventDefault();
      deleteSubCategoriesform.reset();
    });

  // =================================================Delete category=====================================================

  deleteCategoriesform.addEventListener("submit", async (event) => {
    event.preventDefault();
    const selectedCategoryId = categorySelectForDelete.value;

    if (!selectedCategoryId) {
      alert("Please select a category to delete.");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/categories/${selectedCategoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        alert("Category deleted successfully!");
        deleteCategoriesform.reset();
        fetchCategories();
      } else {
        const errorData = await response.json();
        console.error("Error while deleting the category:", errorData);
        alert("Failed to delete the category.");
      }
    } catch (error) {
      console.error("Error while deleting the category:", error);
      alert("An error occurred while deleting the category.");
    }
  });

  document
    .getElementById("cancel-delete-category")
    .addEventListener("click", (event) => {
      event.preventDefault();
      deleteCategoriesform.reset();
    });

  // =================================================Create subcategory==================================================

  document
    .getElementById("sub-category-image")
    .addEventListener("change", (event) => {
      const fileInput = event.target;
      const fileNameSpan = document.getElementById("file-name-sub-category");

      if (fileInput.files.length > 0) {
        fileNameSpan.textContent = fileInput.files[0].name;
      } else {
        fileNameSpan.textContent = "No file selected";
      }
    });

  addSubCategoriesform.addEventListener("submit", async (event) => {
    event.preventDefault();

    const subCategoryName = document.getElementById("sub-category-name").value;

    const formData = new FormData();
    formData.append("name", subCategoryName);
    formData.append("parentCategory", categorySelectForSubcategories.value);
    formData.append("description", `Questios related to ${subCategoryName}.`);

    const mediaFile = document.getElementById("sub-category-image").files[0];
    if (mediaFile) {
      formData.append("categoryPicture", mediaFile);
    }

    if (!subCategoryName) {
      alert("Please provide at least a subcategory name or an image.");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Subcategory added successfully!");
        addSubCategoriesform.reset();
        fetchCategories();
      } else {
        const errorData = await response.json();
        console.error("Error while adding the subcategory:", errorData);
        alert("Failed to add the subcategory.");
      }
    } catch (error) {
      console.error("Error while adding the subcategory:", error);
      alert("An error occurred while adding the subcategory.");
    }
  });

  document
    .getElementById("cancel-sub-category")
    .addEventListener("click", (event) => {
      event.preventDefault();
      const fileNameSpan = document.getElementById("file-name-sub-category");
      fileNameSpan.textContent = "";
      addSubCategoriesform.reset();
    });

  // =================================================Create category=====================================================

  document
    .getElementById("category-image")
    .addEventListener("change", (event) => {
      const fileInput = event.target;
      const fileNameSpan = document.getElementById("file-name-category");

      if (fileInput.files.length > 0) {
        fileNameSpan.textContent = fileInput.files[0].name;
      } else {
        fileNameSpan.textContent = "No file selected";
      }
    });

  addCategoriesForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const categoryName = document.getElementById("category-name").value;
    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("description", `Questios related to ${categoryName}.`);

    const mediaFile = document.getElementById("category-image").files[0];
    if (mediaFile) {
      formData.append("categoryPicture", mediaFile);
    }

    if (!categoryName) {
      alert("Please provide at least a category name.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Category added successfully!");
        addCategoriesForm.reset();
        fetchCategories();
      } else {
        const errorData = await response.json();
        console.error("Error while adding the category:", errorData);
        alert("Failed to add the category.");
      }
    } catch (error) {
      console.error("Error while adding the category:", error);
      alert("An error occurred while adding the category.");
    }
  });

  document
    .getElementById("cancel-category")
    .addEventListener("click", (event) => {
      event.preventDefault();
      const fileNameSpan = document.getElementById("file-name-category");
      fileNameSpan.textContent = "";
      addCategoriesForm.reset();
    });

  fetchCategories();
});
