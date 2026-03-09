document.addEventListener("DOMContentLoaded", () => {

    const data = Core.get("vp_jeunesse_activities") || {};

    // 🔥 HERO
    document.getElementById("youthActTitle").textContent =
        data.heroTitle || "Nos Activités";

    document.getElementById("youthActSubtitle").textContent =
        data.heroSubtitle || "";

    // 🔥 ACTIVITÉS PRINCIPALES
    const mainZone = document.getElementById("youthMainActivities");
    if (mainZone && data.main) {

        mainZone.innerHTML = "";

        data.main.forEach(a => {

            const div = document.createElement("div");
            div.className =
                "bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition";

            div.innerHTML = `
                <h3 class="text-xl font-bold text-purple-700 mb-2">
                    ${a.titre}
                </h3>
                <p class="text-gray-600">${a.description}</p>
            `;

            mainZone.appendChild(div);
        });
    }

    // 🔥 ACTIVITÉS HEBDO
    const weeklyZone = document.getElementById("youthWeeklyActivities");
    if (weeklyZone && data.weekly) {

        weeklyZone.innerHTML = "";

        data.weekly.forEach(w => {

            const div = document.createElement("div");
            div.className =
                "border-l-4 border-purple-600 bg-white p-4 shadow";

            div.innerHTML = `
                <h4 class="font-semibold">${w.titre}</h4>
                <p class="text-gray-600">${w.description}</p>
            `;

            weeklyZone.appendChild(div);
        });
    }

    // 🔥 ÉVÉNEMENTS SPÉCIAUX
    const specialZone = document.getElementById("youthSpecialEvents");
    if (specialZone && data.special) {

        specialZone.innerHTML = "";

        data.special.forEach(s => {

            const div = document.createElement("div");
            div.className =
                "bg-white rounded-lg shadow p-6";

            div.innerHTML = `
                <h3 class="font-semibold text-lg">${s.titre}</h3>
                <p class="text-gray-600">${s.description}</p>
            `;

            specialZone.appendChild(div);
        });
    }

    // 🔥 VIDÉO SPÉCIALE
    const videoZone = document.getElementById("youthSpecialVideo");
    if (videoZone && data.video) {

        videoZone.innerHTML = `
            <video src="${data.video}"
            controls
            class="w-full h-64 rounded-lg shadow-md object-cover"></video>
        `;
    }

    // 🔥 GALERIE À VENIR
    const galleryZone = document.getElementById("youthUpcomingGallery");
    if (galleryZone && data.gallery) {

        galleryZone.innerHTML = "";

        data.gallery.forEach(img => {

            const image = document.createElement("img");
            image.src = img;
            image.className =
                "program-thumb cursor-pointer rounded-md border";

            galleryZone.appendChild(image);
        });
    }

});
document.addEventListener("DOMContentLoaded", () => {

    const textarea = document.getElementById("commentaire");

    textarea?.addEventListener("blur", () => {

        const message = textarea.value.trim();
        if (!message) return;

        const comments = Core.get("vp_youth_comments") || [];

        comments.push({
            id: Date.now(),
            auteur: "Anonyme",
            message,
            date: new Date().toISOString(),
            statut: "en_attente"
        });

        Core.set("vp_youth_comments", comments);

        alert("Commentaire envoyé pour validation 💜");

        textarea.value = "";
    });

});
document.addEventListener("DOMContentLoaded", () => {

    const zone = document.getElementById("publicComments");
    if (!zone) return;

    const comments = Core.get("vp_youth_comments") || [];

    comments
        .filter(c => c.statut === "valide")
        .forEach(c => {

            const div = document.createElement("div");
            div.className = "bg-white p-3 rounded shadow mb-2";

            div.innerHTML = `
                <strong>${c.auteur}</strong>
                <p>${c.message}</p>
            `;

            zone.appendChild(div);
        });
});
document.addEventListener("DOMContentLoaded", () => {

    checkCommentAccess();
    loadComments();

    const btn = document.getElementById("submitComment");

    btn?.addEventListener("click", () => {

        const user = Auth.currentUser();
        if (!user) return;

        const members = Core.get("vp_youth_members") || [];

        const member = members.find(m =>
            m.email === user.email &&
            m.statut === "actif"
        );

        if (!member) return;

        const textArea = document.getElementById("newComment");
        const message = textArea.value.trim();

        if (!message) {
            alert("Message vide");
            return;
        }

        const comments = Core.get("vp_youth_comments") || [];

        comments.push({
            id: Date.now(),
            auteur: member.nom,
            email: member.email,
            message,
            date: new Date().toISOString(),
            statut: "en_attente",
            likes: 0,
            reponses: []
        });

        Core.set("vp_youth_comments", comments);

        textArea.value = "";
        alert("Commentaire envoyé pour validation 💜");
    });

});
function checkCommentAccess() {

    const user = Auth.currentUser();
    const members = Core.get("vp_youth_members") || [];

    const formZone = document.getElementById("commentFormZone");
    const blockedMsg = document.getElementById("commentBlocked");

    if (!user) {
        formZone?.classList.add("hidden");
        blockedMsg?.classList.remove("hidden");
        return;
    }

    const member = members.find(m =>
        m.email === user.email &&
        m.statut === "actif"
    );

    if (!member) {
        formZone?.classList.add("hidden");
        blockedMsg?.classList.remove("hidden");
    }
}
function loadComments() {

    const container = document.getElementById("commentList");
    if (!container) return;

    const comments = Core.get("vp_youth_comments") || [];

    container.innerHTML = "";

    comments
        .filter(c => c.statut === "approuve")
        .sort((a,b) => new Date(b.date) - new Date(a.date))
        .forEach(c => {

            const div = document.createElement("div");
            div.className = "bg-white p-4 rounded shadow";

            div.innerHTML = `
                <strong>${c.auteur}</strong>
                <p class="text-sm text-gray-500">
                    ${new Date(c.date).toLocaleDateString()}
                </p>
                <p class="mt-2">${c.message}</p>
            `;

            container.appendChild(div);
        });
}