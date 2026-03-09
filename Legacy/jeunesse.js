document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       🎨 CHARGEMENT CONTENU DYNAMIQUE
    ===================================== */

    const data = Core.get("vp_jeunesse_settings") || {};
    const activities = Core.get("vp_jeunesse_activities") || [];

    // HERO
    const titleEl = document.getElementById("youthTitle");
    const sloganEl = document.getElementById("youthSlogan");

    if (titleEl) titleEl.textContent = data.title || "JAEL";
    if (sloganEl) sloganEl.textContent =
        data.slogan || "Une génération en feu pour Christ 🔥";

    // ATTRIBUTIONS
    const attrZone = document.getElementById("youthAttributions");
    if (attrZone && data.attributions) {
        attrZone.innerHTML = "";
        data.attributions.forEach(a => {
            const li = document.createElement("li");
            li.textContent = a;
            attrZone.appendChild(li);
        });
    }

    // PRÉSIDENT
    const presidentName = document.getElementById("youthPresidentName");
    const presidentPhoto = document.getElementById("youthPresidentPhoto");

    if (presidentName) presidentName.textContent = data.president?.nom || "";
    if (presidentPhoto) presidentPhoto.src = data.president?.photo || "";

    // GROUPES
    const groupZone = document.getElementById("youthGroups");
    if (groupZone && data.groupes) {
        groupZone.innerHTML = "";
        data.groupes.forEach(g => {
            const div = document.createElement("div");
            div.className =
                "bg-white p-6 rounded-lg shadow text-center hover:bg-purple-50 transition";
            div.textContent = g;
            groupZone.appendChild(div);
        });
    }

    // ACTIVITÉS
    const actZone = document.getElementById("youthActivities");
    if (actZone) {
        actZone.innerHTML = "";

        activities.forEach(act => {
            const div = document.createElement("div");
            div.className =
                "event mb-6 border-l-4 border-purple-600 pl-4";

            div.innerHTML = `
                <h3 class="font-semibold">${act.titre}</h3>
                <p class="text-gray-600">${act.description}</p>
            `;

            actZone.appendChild(div);
        });
    }

    /* =====================================
       📩 MODAL ADHÉSION
    ===================================== */

    const adhesionBtn = document.getElementById("adhesionBtn");
    const adhesionModal = document.getElementById("adhesionModal");
    const closeAdhesionModal = document.getElementById("closeAdhesionModal");

    adhesionBtn?.addEventListener("click", () => {
        adhesionModal?.classList.remove("hidden");
    });

    closeAdhesionModal?.addEventListener("click", () => {
        adhesionModal?.classList.add("hidden");
    });

    /* =====================================
       📩 FORMULAIRE ADHÉSION
    ===================================== */

    const form = document.getElementById("adhesionForm");

    if (form) {

        form.addEventListener("submit", (e) => {

            e.preventDefault();

            const nom = document.getElementById("adhesionNom")?.value.trim();
            const email = document.getElementById("adhesionEmail")?.value.trim();
            const sexe = document.getElementById("adhesionSexe")?.value;
            const phone = document.getElementById("adhesionPhone")?.value.trim();
            const motivation = document.getElementById("adhesionMotivation")?.value.trim();

            if (!nom || !email || !sexe || !phone || !motivation) {
                alert("Tous les champs sont obligatoires");
                return;
            }

            const requests = Core.get("vp_youth_requests") || [];

            const newRequest = {
                id: Date.now(),
                nom,
                email,
                sexe,
                phone,
                motivation,
                date: new Date().toISOString(),
                statut: "en_attente"
            };

            requests.push(newRequest);

            Core.set("vp_youth_requests", requests); // ✅ Core majuscule

            console.log("Nouvelle demande enregistrée :", newRequest);

            alert("Demande d'adhésion envoyée pour validation 💜");

            form.reset();
            adhesionModal?.classList.add("hidden");
        });
    }

    /* =====================================
       🔐 LOGIN ADMIN JEUNESSE
    ===================================== */

    const adminBtn = document.getElementById("youthAdminBtn");
    const loginModal = document.getElementById("youthLoginModal");
    const loginForm = document.getElementById("youthLoginForm");

    adminBtn?.addEventListener("click", () => {

        const user = Auth.currentUser();

        if (!user) {
            loginModal?.classList.remove("hidden");
            return;
        }

        if (
            user.role === "youth-super-admin" ||
            user.role === "youth-admin" ||
            user.role === "super-admin"
        ) {
            window.location.href = "jeunesse-admin.html";
        } else {
            alert("Accès refusé");
        }
    });

    loginForm?.addEventListener("submit", (e) => {

        e.preventDefault();

        const email =
            document.getElementById("youthEmail")?.value.trim();

        const password =
            document.getElementById("youthPassword")?.value.trim();

        const success = Auth.login(email, password);

        if (!success) {
            alert("Identifiants incorrects");
            return;
        }

        const user = Auth.currentUser();

        if (
            user.role === "youth-super-admin" ||
            user.role === "youth-admin" ||
            user.role === "super-admin"
        ) {
            window.location.href = "jeunesse-admin.html";
        } else {
            alert("Accès réservé à l'administration jeunesse");
            Auth.logout();
        }
    });

});