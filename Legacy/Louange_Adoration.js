document.addEventListener("DOMContentLoaded", () => {

    if (typeof Core === "undefined") return;

    const data = Core.get("vp_departements_media") || [];

    const current = data.find(d => 
        d.departement.toLowerCase() === "louange et adoration"
    );

    if (!current || !current.president) return;

    const nameEl = document.getElementById("presidentNameDisplay");
    const photoEl = document.getElementById("presidentPhotoDisplay");
    const descEl = document.getElementById("presidentDescDisplay");

    if (nameEl) nameEl.textContent = current.president.nom || "";
    if (photoEl) photoEl.src = current.president.photo || "";
    if (descEl) descEl.textContent = current.president.description || "";

});