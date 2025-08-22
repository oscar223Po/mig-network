import "./app.min.js";
import "./mask.min.js";
import "./base.min.js";
import "./popup.min.js";
import "./blockhead.min.js";
import "./dynamic.min.js";
/* empty css             */
/* empty css         */
let currentStep = 1;
const totalSteps = 3;
let selectedChoice = 1;
const steps = document.querySelectorAll(".head-steps__step");
const contents = document.querySelectorAll(".content-steps__body");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const checkboxContainer = document.getElementById("checkboxContainer");
const cancelLink = document.getElementById("cancelLink");
const serveLinks = document.querySelectorAll(".serve__link");
serveLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    serveLinks.forEach((l) => l.classList.remove("serve__link--active"));
    link.classList.add("serve__link--active");
    selectedChoice = link.dataset.choice;
  });
});
function updateForm() {
  steps.forEach((step, index) => {
    step.classList.remove("active", "completed");
    if (index + 1 < currentStep) {
      step.classList.add("completed");
    } else if (index + 1 === currentStep) {
      step.classList.add("active");
    }
  });
  contents.forEach((content) => content.classList.remove("active"));
  if (currentStep === 1) {
    document.getElementById("content1").classList.add("active");
  } else if (currentStep === 2) {
    document.getElementById(`content2-${selectedChoice}`).classList.add("active");
  } else if (currentStep === 3) {
    document.getElementById("content3").classList.add("active");
  }
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
