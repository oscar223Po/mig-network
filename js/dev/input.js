document.querySelectorAll('.file input[type="file"]').forEach((input2) => {
  input2.addEventListener("change", () => {
    const fileNameSpan = input2.closest("label").nextElementSibling;
    if (input2.files.length > 0) {
      fileNameSpan.textContent = "Вы выбрали: " + input2.files[0].name;
    } else {
      fileNameSpan.textContent = "";
    }
  });
});
const input = document.querySelector(".search__input");
const cancelBtn = document.querySelector(".search__button--cancel");
input.addEventListener("input", () => {
  if (input.value.trim() !== "") {
    cancelBtn.classList.add("active-clear");
  } else {
    cancelBtn.classList.remove("active-clear");
  }
});
cancelBtn.addEventListener("click", () => {
  input.value = "";
  cancelBtn.classList.remove("active-clear");
  input.focus();
});
