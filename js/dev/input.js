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
