// ===============================
// ACCUEIL.JS - VERTS PATURAGES
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       📖 VERSET DU JOUR PREMIUM
    =============================== */

    loadVerseOfTheDay();
    checkWeeklyReset();

    function loadVerseOfTheDay() {

        const today = new Date().toISOString().split("T")[0];
        const todayData = Core.get("vp_today_verse");

        // Si déjà choisi aujourd'hui
        if (todayData && todayData.date === today) {
            displayVerse(todayData.verseId);
            updateLikeDisplay(todayData.verseId);
            return;
        }

        const verses = Core.get("vp_weekly_verses") || [];
        const history = Core.get("vp_verse_history") || [];

        if (!verses.length) return;

        // Éviter répétition des 2 derniers jours
        const lastTwo = history.slice(-2).map(h => h.verseId);

        const available = verses.filter(v => !lastTwo.includes(v.id));
        const pool = available.length ? available : verses;

        const random = pool[Math.floor(Math.random() * pool.length)];

        Core.set("vp_today_verse", {
            date: today,
            verseId: random.id
        });

        history.push({
            date: today,
            verseId: random.id
        });

        Core.set("vp_verse_history", history);

        displayVerse(random.id);
        updateLikeDisplay(random.id);
    }
    function checkWeeklyReset() {

    const today = new Date();
    const day = today.getDay(); // 1 = Lundi

    const lastReset = Core.get("vp_last_reset");

    const todayDate = today.toISOString().split("T")[0];

    if (day === 1 && lastReset !== todayDate) {

        Core.set("vp_verse_likes", []);
        Core.set("vp_verse_history", []);
        Core.set("vp_today_verse", null);
        Core.set("vp_last_reset", todayDate);

        console.log("🔄 Reset hebdomadaire effectué");
    }
}

    function displayVerse(id) {

        const verses = Core.get("vp_weekly_verses") || [];
        const verse = verses.find(v => v.id === id);

        if (!verse) return;

        const textEl = document.getElementById("verseText");
        const refEl = document.getElementById("verseReference");

        if (textEl) textEl.textContent = verse.texte;
        if (refEl) refEl.textContent = verse.reference;
    }

    /* ===============================
       ❤️ LIKE ANONYME
    =============================== */

    function updateLikeDisplay(verseId) {

        if (!verseId) return;

        const countEl = document.getElementById("verseLikeCount");
        const btn = document.getElementById("likeVerseBtn");

        const likesData = Core.get("vp_verse_likes") || [];

        const getLikes = () => {
            const found = likesData.find(l => l.verseId === verseId);
            return found ? found.likes : 0;
        };

        if (countEl) {
            countEl.textContent = getLikes() + " likes";
        }

        btn?.addEventListener("click", () => {

            const alreadyLiked =
                localStorage.getItem("liked_" + verseId);

            if (alreadyLiked) {
                alert("Vous avez déjà aimé ce verset 💜");
                return;
            }

            let found = likesData.find(l => l.verseId === verseId);

            if (found) {
                found.likes++;
            } else {
                likesData.push({ verseId, likes: 1 });
            }

            Core.set("vp_verse_likes", likesData);
            localStorage.setItem("liked_" + verseId, "true");

            countEl.textContent = getLikes() + " likes";
        });
    }

    /* ===============================
       MODAL REJOIGNEZ-NOUS
    =============================== */

    const joinBtn = document.getElementById("joinBtn");
    const joinModal = document.getElementById("joinModal");
    const closeModal = document.getElementById("closeModal");

    joinBtn?.addEventListener("click", () => {
        joinModal?.classList.remove("hidden");
    });

    closeModal?.addEventListener("click", () => {
        joinModal?.classList.add("hidden");
    });

    joinModal?.addEventListener("click", (e) => {
        if (e.target === joinModal) {
            joinModal.classList.add("hidden");
        }
    });

    /* ===============================
       🔐 LOGIN ADMIN
    =============================== */

    const adminBtn = document.getElementById("adminBtn");
    const adminModal = document.getElementById("adminModal");
    const closeAdminModal = document.getElementById("closeAdminModal");
    const loginForm = document.getElementById("adminLoginForm");
    const errorText = document.getElementById("adminError");

    adminBtn?.addEventListener("click", () => {
        adminModal?.classList.remove("hidden");
    });

    closeAdminModal?.addEventListener("click", () => {
        adminModal?.classList.add("hidden");
    });

    loginForm?.addEventListener("submit", (e) => {

        e.preventDefault();

        const email = document.getElementById("adminEmail").value.trim();
        const password = document.getElementById("adminPassword").value.trim();

        const success = Auth.login(email, password);

        if (success) {
            window.location.href = "Bureau-pastorale.html";
        } else {
            if (errorText) {
                errorText.textContent = "Email ou mot de passe incorrect.";
                errorText.classList.remove("hidden");
            }
        }
    });

    /* ===============================
       📩 ADHÉSION ÉGLISE
    =============================== */

    const joinForm = document.getElementById("joinForm");

    joinForm?.addEventListener("submit", (e) => {

        e.preventDefault();

        const formData = new FormData(joinForm);
        const data = Object.fromEntries(formData.entries());

        const adhesion = {
            id: Date.now(),
            nom: data.nom,
            postnom: data.postnom,
            prenom: data.prenom,
            sexe: data.sexe,
            email: data.email,
            numero: data.numero,
            adresse: data.adresse_physique,
            temoignage: data.temoignage,
            statut: "en_attente",
            date: new Date().toISOString()
        };

        const adhesions = Core.get("vp_adhesions") || [];

        adhesions.push(adhesion);
        Core.set("vp_adhesions", adhesions);

        alert("Votre demande a été envoyée avec succès.");

        joinForm.reset();
        joinModal?.classList.add("hidden");
    });

});