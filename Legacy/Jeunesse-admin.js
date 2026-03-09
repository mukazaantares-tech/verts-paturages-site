document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       🔐 PROTECTION ACCÈS
    =============================== */

    Auth.protectPage();

    const user = Auth.currentUser();

    if (
        !user ||
        (
            user.role !== "youth-super-admin" &&
            user.role !== "youth-admin" &&
            user.role !== "super-admin"
        )
    ) {
        alert("Accès réservé à l'administration jeunesse");
        window.location.href = "Accueil.html";
        return;
    }

    /* ===============================
       INITIALISATION
    =============================== */

    initSidebar();
    loadDashboard();
    loadActivities();
    loadAdhesions();
    loadMembers();
    loadAdminComments();
    initHeader();

    


});
function loadDashboard() {

    const members = Core.get("vp_youth_members") || [];
    const requests = Core.get("vp_youth_requests") || [];
    const activities = Core.get("vp_jeunesse_activities") || [];
    const admins = Core.get("vp_youth_admins") || [];
    const comments = Core.get("vp_youth_comments") || [];

    document.getElementById("statMembers").textContent = members.length;

    document.getElementById("statPending").textContent =
        requests.filter(r => r.statut === "en_attente").length;

    document.getElementById("statActivities").textContent = activities.length;

    document.getElementById("statAdmins").textContent = admins.length;

    document.getElementById("statCommentsPending").textContent =
        comments.filter(c => c.statut === "en_attente").length;
}

function renderYouthChart(members) {

    const months = {};

    members.forEach(m => {
        const date = new Date(m.dateIntegration);
        const key = date.getFullYear() + "-" + (date.getMonth()+1);
        months[key] = (months[key] || 0) + 1;
    });

    const ctx = document.getElementById("youthChart");

    if (!ctx) return;

    new Chart(ctx, {
        type: "line",
        data: {
            labels: Object.keys(months),
            datasets: [{
                label: "Évolution des membres",
                data: Object.values(months),
                borderColor: "#7e22ce",
                fill: false
            }]
        }
    });
}
function loadAdhesions() {

    const container = document.getElementById("adhesionList");
    if (!container) return;

    const requests = Core.get("vp_youth_requests") || [];

    container.innerHTML = "";

    requests
        .filter(r => r.statut === "en_attente")
        .forEach(req => {

            const div = document.createElement("div");
            div.className = "bg-white p-4 rounded shadow mb-3";

            div.innerHTML = `
                <strong>${req.nom}</strong>
                <p>${req.email}</p>
                <p>${req.sexe}</p>
                <div class="flex gap-2 mt-2">
                    <button onclick="approveYouth(${req.id})"
                        class="bg-green-600 text-white px-3 py-1 rounded">
                        Accepter
                    </button>
                    <button onclick="rejectYouth(${req.id})"
                        class="bg-red-600 text-white px-3 py-1 rounded">
                        Refuser
                    </button>
                </div>
            `;

            container.appendChild(div);
        });
}

window.approveYouth = function(id) {

    const requests = Core.get("vp_youth_requests") || [];
    const members = Core.get("vp_youth_members") || [];

    const req = requests.find(r => r.id === id);
    if (!req) return;

    if (members.some(m => m.email === req.email)) {
        alert("Déjà membre");
        return;
    }

    members.push({
        id: Date.now(),
        nom: req.nom,
        email: req.email,
        sexe: req.sexe,
        phone: req.phone,
        dateIntegration: new Date().toISOString(),
        statut: "actif",
        groupe: null
    });

    req.statut = "accepte";

    Core.set("vp_youth_members", members);
    Core.set("vp_youth_requests", requests);

    loadAdhesions();
    loadMembers();
    loadDashboard();

};

window.rejectYouth = function(id) {

    const requests = Core.get("vp_youth_requests") || [];
    const req = requests.find(r => r.id === id);
    if (!req) return;

    req.statut = "refuse";

    Core.set("vp_youth_requests", requests);

    loadAdhesions();
    loadDashboard();
};
function loadMembers() {

    const container = document.getElementById("memberList");
    if (!container) return;

    const members = Core.get("vp_youth_members") || [];
    container.innerHTML = "";

    members.forEach(m => {

        const div = document.createElement("div");
        div.className = "bg-white p-4 rounded shadow mb-3";

        div.innerHTML = `
            <strong>${m.nom}</strong>
            <p>${m.email}</p>
            <p>Statut: ${m.statut}</p>
            <div class="flex gap-2 mt-2">
                <button onclick="toggleMember(${m.id})"
                class="bg-yellow-500 text-white px-3 py-1 rounded">
                    ${m.statut === "actif" ? "Désactiver" : "Activer"}
                </button>
                <button onclick="deleteMember(${m.id})"
                class="bg-red-600 text-white px-3 py-1 rounded">
                    Supprimer
                </button>
            </div>
        `;

        container.appendChild(div);
    });
}

window.toggleMember = function(id) {

    const members = Core.get("vp_youth_members") || [];
    const member = members.find(m => m.id === id);
    if (!member) return;

    member.statut =
        member.statut === "actif" ? "inactif" : "actif";

    Core.set("vp_youth_members", members);
    loadMembers();
};

window.deleteMember = function(id) {

    if (!confirm("Supprimer ce membre ?")) return;

    let members = Core.get("vp_youth_members") || [];
    members = members.filter(m => m.id !== id);

    Core.set("vp_youth_members", members);
    loadMembers();
    loadDashboard();
};
function loadActivities() {

    const data = Core.get("vp_jeunesse_data") || {};
    const activities = Core.get("vp_jeunesse_activities") || [];
    const container = document.getElementById("activityList");
    if (!container) return;
    container.innerHTML = "";

    activities.forEach(act => {
        const div = document.createElement("div");
        div.className = "bg-white p-4 rounded shadow mb-3";
        div.innerHTML = `
            <strong>${act.titre}</strong>
            <p>${act.description}</p>
            <button onclick="deleteActivity(${act.id})"
            class="bg-red-600 text-white px-3 py-1 rounded mt-2">
                Supprimer
            </button>
        `;
        container.appendChild(div);
    }
    );
}
function initSidebar() {

    document.querySelectorAll(".sidebar li").forEach(item => {

        item.addEventListener("click", () => {

            document.querySelectorAll(".sidebar li")
                .forEach(li => li.classList.remove("active"));

            item.classList.add("active");

            const sectionId = item.dataset.section;

            document.querySelectorAll(".section")
                .forEach(sec => sec.classList.add("hidden"));

            document.getElementById(sectionId)
                ?.classList.remove("hidden");

        });

    });

}
function initHeader() {

    const user = Auth.currentUser();
    if (!user) return;

    const nameEl = document.getElementById("youthAdminName");
    const roleEl = document.getElementById("youthAdminRole");

    if (nameEl) nameEl.textContent = user.name || user.email;

    if (roleEl) {
        if (user.role === "youth-super-admin") {
            roleEl.textContent = "Haut-Administrateur Jeunesse";
        } else if (user.role === "youth-admin") {
            roleEl.textContent = "Administrateur Jeunesse";
        } else if (user.role === "super-admin") {
            roleEl.textContent = "Super Admin Général";
        }
    }

    document.getElementById("logoutYouth")
        ?.addEventListener("click", () => {
            Auth.logout();
        });
}
function loadComments() {

    const container = document.getElementById("commentList");
    if (!container) return;

    const comments = Core.get("vp_youth_comments") || [];

    container.innerHTML = "";

    comments.forEach(c => {

        const div = document.createElement("div");
        div.className = "bg-white p-4 rounded shadow mb-3";

        div.innerHTML = `
            <strong>${c.auteur}</strong>
            <p>${c.message}</p>
            <p class="text-xs text-gray-400">
                ${new Date(c.date).toLocaleString()}
            </p>
            <p class="text-sm font-semibold">
                Statut: ${c.statut}
            </p>

            <div class="flex gap-2 mt-2">
                <button onclick="approveComment(${c.id})"
                class="bg-green-600 text-white px-3 py-1 rounded">
                    Valider
                </button>

                <button onclick="rejectComment(${c.id})"
                class="bg-red-600 text-white px-3 py-1 rounded">
                    Refuser
                </button>

                <button onclick="deleteComment(${c.id})"
                class="bg-gray-600 text-white px-3 py-1 rounded">
                    Supprimer
                </button>
            </div>
        `;

        container.appendChild(div);
    });
}
window.approveComment = function(id) {

    const comments = Core.get("vp_youth_comments") || [];
    const comment = comments.find(c => c.id === id);
    if (!comment) return;
    comment.statut = "valide";
    Core.set("vp_youth_comments", comments);
    loadComments();
    loadDashboard();
};

window.rejectComment = function(id) {   
    const comments = Core.get("vp_youth_comments") || [];
    const comment = comments.find(c => c.id === id);
    if (!comment) return;
    comment.statut = "refuse";
    Core.set("vp_youth_comments", comments);
    loadComments();
    loadDashboard();
};

window.deleteComment = function(id) {
    const comments = Core.get("vp_youth_comments") || [];
    const filtered = comments.filter(c => c.id !== id);
    Core.set("vp_youth_comments", filtered);
    loadComments();
    loadDashboard();
};
window.approveComment = function(id) {

    const comments = Core.get("vp_youth_comments") || [];

    const comment = comments.find(c => c.id === id);
    if (!comment) return;

    comment.statut = "valide";

    Core.set("vp_youth_comments", comments);
    loadComments();
    loadDashboard();
};

window.rejectComment = function(id) {

    const comments = Core.get("vp_youth_comments") || [];

    const comment = comments.find(c => c.id === id);
    if (!comment) return;

    comment.statut = "refuse";

    Core.set("vp_youth_comments", comments);
    loadComments();
};

window.deleteComment = function(id) {

    let comments = Core.get("vp_youth_comments") || [];

    comments = comments.filter(c => c.id !== id);

    Core.set("vp_youth_comments", comments);
    loadComments();
};
function loadAdminComments() {

    const container = document.getElementById("adminCommentList");
    if (!container) return;

    const comments = Core.get("vp_youth_comments") || [];

    container.innerHTML = "";

    comments
        .filter(c => c.statut === "en_attente")
        .forEach(c => {

            const div = document.createElement("div");
            div.className = "bg-white p-4 rounded shadow mb-3";

            div.innerHTML = `
                <strong>${c.auteur}</strong>
                <p>${c.message}</p>

                <div class="mt-2 flex gap-2">
                    <button onclick="approveComment(${c.id})"
                        class="bg-green-600 text-white px-3 py-1 rounded">
                        Approuver
                    </button>

                    <button onclick="deleteComment(${c.id})"
                        class="bg-red-600 text-white px-3 py-1 rounded">
                        Supprimer
                    </button>
                </div>
            `;

            container.appendChild(div);
        });
}

window.approveComment = function(id) {

    const comments = Core.get("vp_youth_comments") || [];
    const comment = comments.find(c => c.id === id);
    if (!comment) return;

    comment.statut = "approuve";

    Core.set("vp_youth_comments", comments);
    loadAdminComments();
};

window.deleteComment = function(id) {

    let comments = Core.get("vp_youth_comments") || [];
    comments = comments.filter(c => c.id !== id);

    Core.set("vp_youth_comments", comments);
    loadAdminComments();
};