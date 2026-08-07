document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector("aside");

  const toggle = document.getElementById("sidebarToggle");

  const overlay = document.getElementById("sidebarOverlay");

  if (!sidebar || !toggle || !overlay) return;

  function openSidebar() {
    sidebar.classList.add("open");

    overlay.classList.add("active");

    document.body.classList.add("menu-open");
  }

  function closeSidebar() {
    sidebar.classList.remove("open");

    overlay.classList.remove("active");

    document.body.classList.remove("menu-open");
  }

  toggle.addEventListener("click", () => {
    if (sidebar.classList.contains("open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay.addEventListener("click", closeSidebar);
  const closeBtn = document.getElementById("sidebarClose");

  closeBtn?.addEventListener("click", closeSidebar);

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeSidebar();
    }
  });

  document.querySelectorAll(".sidebar li").forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });
});
