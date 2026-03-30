document
.getElementById("adminLoginForm")
?.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("adminEmail").value;

    const password =
        document.getElementById("adminPassword").value;

    const success =
        await AuthService.login(email, password);

    if (success) {

        window.location.href =
            "Bureau-pastorale.html";

    }

});
// ouvrir modal admin
document
.getElementById("adminBtn")
?.addEventListener("click", () => {

    document
    .getElementById("adminModal")
    .classList.remove("hidden");

});

// fermer modal
document
.getElementById("closeAdminModal")
?.addEventListener("click", () => {

    document
    .getElementById("adminModal")
    .classList.add("hidden");

});