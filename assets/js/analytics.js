document.addEventListener("click", function (event) {
  const link = event.target.closest(".project-link");

  if (!link) return;

  if (typeof window.gtag === "function") {
    window.gtag("event", "project_click", {
      project_name: link.dataset.project || "unknown_project",
      destination: link.href,
      page_url: window.location.href
    });
  }
});
