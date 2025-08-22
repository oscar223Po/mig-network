document.querySelectorAll('.file input[type="file"]').forEach((input) => {
  input.addEventListener("change", () => {
    const fileNameSpan = input.closest("label").nextElementSibling;
    if (input.files.length > 0) {
      fileNameSpan.textContent = "Вы выбрали: " + input.files[0].name;
    } else {
      fileNameSpan.textContent = "";
    }
  });
});
const inputSearch = document.querySelector(".search__input");
const cancelBtn = document.querySelector(".search__button--cancel");
if (cancelBtn !== null) {
  inputSearch.addEventListener("input", () => {
    if (inputSearch.value.trim() !== "") {
      cancelBtn.classList.add("active-clear");
    } else {
      cancelBtn.classList.remove("active-clear");
    }
  });
  cancelBtn.addEventListener("click", () => {
    inputSearch.value = "";
    cancelBtn.classList.remove("active-clear");
    inputSearch.focus();
  });
}
