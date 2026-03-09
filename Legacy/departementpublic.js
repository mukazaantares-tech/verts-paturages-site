// ===============================
// DEPARTEMENT PUBLIC MANAGER
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(".adhesionBtn");
    const modal = document.getElementById("adhesionModal");
    const closeBtn = document.getElementById("closeAdhesionModal");
    const form = document.getElementById("adhesionForm");

    let currentDepartement = null;
    let currentSous = null;

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            currentDepartement = btn.dataset.departement;
            currentSous = btn.dataset.sous || null;
            modal.classList.remove("hidden");
        });
    });

    closeBtn?.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    form?.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form).entries());

        const demandes = Core.get("vp_departement_requests") || [];

        demandes.push({
            id: Date.now(),
            nom: data.name,
            email: data.email,
            sexe: data.sexe,
            phone: data.phone,
            motivation: data.motivation,
            departement: currentDepartement,
            sousDepartement: currentSous,
            statut: "en_attente",
            date: new Date().toISOString()
        });

        Core.set("vp_departement_requests", demandes);

        alert("Demande envoyée avec succès.");
        form.reset();
        modal.classList.add("hidden");
    });

});
document.addEventListener("DOMContentLoaded", () => {

    if (typeof Core === "undefined") return;

    const body = document.body;

    const departementName = body.dataset.departement;
    const sousDepartementName = body.dataset.sous;

    if (!departementName) return;

    const data = Core.get("vp_departements_media") || [];

    const dept = data.find(d =>
        d.departement.toLowerCase() === departementName.toLowerCase()
    );

    if (!dept) return;

    let target = dept;

    // 🔥 Si sous-département
    if (sousDepartementName && dept.sousDepartements) {
        const sous = dept.sousDepartements.find(s =>
            s.nom.toLowerCase() === sousDepartementName.toLowerCase()
        );
        if (sous) target = sous;
    }

    // 🔥 PRESIDENT
    if (target.president) {

        const nameEl = document.getElementById("presidentNameDisplay");
        const photoEl = document.getElementById("presidentPhotoDisplay");
        const descEl = document.getElementById("presidentDescDisplay");

        if (nameEl) nameEl.textContent = target.president.nom || "";
        if (photoEl) photoEl.src = target.president.photo || "";
        if (descEl) descEl.textContent = target.president.description || "";
    }

    // 🔥 VIDEOS
    const videoZone = document.getElementById("videoZone");

    if (videoZone && target.videos) {
        videoZone.innerHTML = "";

        target.videos.forEach(v => {

            const video = document.createElement("video");
            video.src = v.url;
            video.controls = true;
            video.className = "w-full h-64 rounded-lg shadow-md mb-4";

            videoZone.appendChild(video);
        });
    }

    // 🔥 IMAGES
    const galleryZone = document.getElementById("galleryZone");

    if (galleryZone && target.images) {
        galleryZone.innerHTML = "";

        target.images.forEach(img => {

            const image = document.createElement("img");
            image.src = img.url;
            image.className = "w-48 rounded-lg shadow-md mb-4";

            galleryZone.appendChild(image);
        });
    }

});