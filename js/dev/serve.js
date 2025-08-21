document.querySelectorAll("[data-fls-serve]").forEach((list) => {
  const links = list.querySelectorAll(".serve__link");
  links.forEach((link) => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      list.querySelector(".serve__link--active")?.classList.remove("serve__link--active");
      this.classList.add("serve__link--active");
    });
  });
});
