import "./app.min.js";
import "./base.min.js";
import "./popup.min.js";
let currentStep = 1;
const totalSteps = 3;
const steps = document.querySelectorAll(".head-steps__step");
const contents = document.querySelectorAll(".content-steps__body");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const checkboxContainer = document.getElementById("checkboxContainer");
const cancelLink = document.getElementById("cancelLink");
function updateForm() {
  steps.forEach((step, index) => {
    step.classList.remove("active", "completed");
    if (index + 1 < currentStep) {
      step.classList.add("completed");
    } else if (index + 1 === currentStep) {
      step.classList.add("active");
    }
  });
  contents.forEach((content, index) => {
    content.classList.toggle("active", index + 1 === currentStep);
  });
  prevBtn.style.display = currentStep > 1 ? "inline-block" : "none";
  if (currentStep === totalSteps) {
    nextBtn.textContent = "Оформить заказ";
    checkboxContainer.style.display = "flex";
  } else {
    nextBtn.textContent = "Далее";
    checkboxContainer.style.display = "none";
  }
  cancelLink.style.display = currentStep === 1 ? "block" : "none";
}
nextBtn.addEventListener("click", () => {
  if (currentStep < totalSteps) {
    currentStep++;
    updateForm();
  } else {
    if (document.getElementById("agree").checked) {
      alert("Заказ оформлен!");
    } else {
      alert("Необходимо согласиться на обработку данных");
    }
  }
});
prevBtn.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep--;
    updateForm();
  }
});
cancelLink.addEventListener("click", (e) => {
  e.preventDefault();
  if (confirm("Вы уверены, что хотите отменить оформление?")) {
    currentStep = 1;
    updateForm();
  }
});
updateForm();
const links = document.querySelectorAll(".content-steps__link");
links.forEach((link) => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(".content-steps__link--active")?.classList.remove("content-steps__link--active");
    this.classList.add("content-steps__link--active");
  });
});
