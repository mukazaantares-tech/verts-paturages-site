document.addEventListener("DOMContentLoaded", () => {

    const dept = document.body.dataset.departement;
    const sous = document.body.dataset.sous || "General";
    const deptTitle = document.getElementById("deptTitleDisplay");
    if (deptTitle) deptTitle.textContent = dept;

    if (!dept) return;

    const data = Core.get("vp_departements_media") || [];

    const current = data.find(d =>
        d.departement === dept &&
        d.sousDepartement === sous
    );

    if (!current) return;

    /* ===============================
       TITRE AUTOMATIQUE
    =============================== */

    const pageTitle = document.getElementById("pageTitle");

    if (pageTitle) {
        if (sous === "General") {
            pageTitle.textContent = `Département : ${dept}`;
        } else {
            pageTitle.textContent = `Sous-Département : ${sous}`;
        }
    }

    /* ===============================
       PRESIDENT
    =============================== */

    const nameEl = document.getElementById("presidentNameDisplay");
    const descEl = document.getElementById("presidentDescDisplay");
    const photoEl = document.getElementById("presidentPhotoDisplay");

    if (nameEl) {
        nameEl.textContent = current.president?.nom || "";
    }

    if (descEl) {
        descEl.textContent = current.president?.description || "";
    }

    if (photoEl) {
        photoEl.src = current.president?.photo || "";
    }

    /* ===============================
       ACTIVITES
    =============================== */

    const activitesZone = document.getElementById("activitesZone");

    if (activitesZone && Array.isArray(current.activites)) {
        activitesZone.innerHTML = "";

        current.activites.forEach(a => {
            const li = document.createElement("li");
            li.textContent = a;
            activitesZone.appendChild(li);
        });
    }

    /* ===============================
       VIDEOS
    =============================== */

    const videoZone = document.getElementById("videoZone");

    if (videoZone && Array.isArray(current.videos)) {
        videoZone.innerHTML = "";

        current.videos.forEach(v => {
            const video = document.createElement("video");
            video.src = v;
            video.controls = true;
            video.className = "w-full h-64 rounded-lg shadow-md";
            videoZone.appendChild(video);
        });
    }

    /* ===============================
       GALERIE
    =============================== */

    const galleryZone = document.getElementById("galleryZone");

    if (galleryZone && Array.isArray(current.images)) {
        galleryZone.innerHTML = "";

        current.images.forEach(img => {
            const image = document.createElement("img");
            image.src = img;
            image.className = "rounded-lg shadow-md";
            galleryZone.appendChild(image);
        });
    }

});