// ===============================
// BUREAU.JS - VERTS PATURAGES
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       PROTECTION PAGE
    =============================== */

    Auth.protectPage();

    const user = Auth.currentUser();

    const nameEl = document.querySelector(".admin-name");
    const roleEl = document.querySelector(".admin-role");

    if (user) {
        if (nameEl) nameEl.textContent = user.name;

        if (roleEl) {
            roleEl.textContent =
                user.role === "super-admin"
                    ? "Haut-Administrateur"
                    : "Administrateur";
        }
    }

    const paramMenu = document.querySelector('[data-section="parametres"]');

    if (paramMenu && user.role !== "super-admin") {
        paramMenu.style.display = "none";
    }

    /* ===============================
       LOGOUT
    =============================== */

    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            Auth.logout();
        });
    }

    /* ===============================
       SIDEBAR NAVIGATION
    =============================== */

    /* ===============================
   SIDEBAR NAVIGATION
================================ */

document.querySelectorAll(".sidebar li").forEach(item => {

    item.addEventListener("click", () => {

        // 🔹 Activer menu
        document.querySelectorAll(".sidebar li")
            .forEach(li => li.classList.remove("active"));

        item.classList.add("active");

        // 🔹 Afficher section correspondante
        const sectionId = item.getAttribute("data-section");

        document.querySelectorAll(".section")
            .forEach(sec => sec.classList.remove("active"));

        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add("active");
        }

        // 🔥 Initialiser la carte UNIQUEMENT si Paramètres
        if (sectionId === "parametres") {

            setTimeout(() => {

                if (document.getElementById("mapAdmin")) {

                    initAdminMap();

                    if (adminMap) {
                        adminMap.invalidateSize();
                    }

                }

            }, 300);
        }

    });

});

        
    /* ===============================
       DASHBOARD STATS
    =============================== */

    function updateDashboard() {

        const membres = Core.get("membres");
        const adhesions = Core.get("adhesions");
        const departements = Core.get("departements");
        const instructions = Core.get("instructions");
        const admins = Core.get("vp_admins");

        document.getElementById("statMembres").textContent = membres.length;
        document.getElementById("statAdhesions").textContent = adhesions.length;
        document.getElementById("statDepartements").textContent = departements.length;
        document.getElementById("statInstructions").textContent = instructions.length;
        document.getElementById("statAdmins").textContent = admins.length;
    }

    updateDashboard();

    /* ===============================
       ALERTES MODERNES
    =============================== */

    function showAlert(message) {

        const container = document.getElementById("alertsContainer");
        if (!container) return;

        const div = document.createElement("div");
        div.className = "alert";
        div.textContent = message;

        container.prepend(div);

        setTimeout(() => {
            div.remove();
        }, 4000);
    }

    /* ===============================
       PROGRAMME PASTORAL
    =============================== */

    const addProgrammeForm = document.getElementById("addProgrammeForm");
    const programmeTable = document.querySelector("#programmeTable tbody");

    function renderProgramme() {

        let programmes = Core.get("programmes");

        // Tri par date
        programmes.sort((a, b) => new Date(a.date) - new Date(b.date));

        programmeTable.innerHTML = "";

        if (programmes.length === 0) {
            programmeTable.innerHTML =
                `<tr><td colspan="4">Aucune activité enregistrée.</td></tr>`;
            return;
        }

        programmes.forEach((p, i) => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${p.titre}</td>
                <td>${p.description}</td>
                <td>${new Date(p.date).toLocaleDateString()}</td>
                <td>
                    <button data-index="${i}" class="edit-programme">Modifier</button>
                    <button data-index="${i}" class="delete-programme">Supprimer</button>
                </td>
            `;

            programmeTable.appendChild(row);
        });

        attachProgrammeEvents();
    }

    function attachProgrammeEvents() {

        document.querySelectorAll(".delete-programme").forEach(btn => {
            btn.addEventListener("click", () => {

                const index = btn.getAttribute("data-index");
                let programmes = Core.get("programmes");

                if (confirm("Supprimer cette activité ?")) {
                    const removed = programmes.splice(index, 1);
                    Core.set("programmes", programmes);
                    renderProgramme();
                    showAlert(`Activité supprimée : ${removed[0].titre}`);
                }
            });
        });

        document.querySelectorAll(".edit-programme").forEach(btn => {
            btn.addEventListener("click", () => {

                const index = btn.getAttribute("data-index");
                let programmes = Core.get("programmes");

                const p = programmes[index];

                addProgrammeForm.titre.value = p.titre;
                addProgrammeForm.description.value = p.description;
                addProgrammeForm.date.value = p.date;

                programmes.splice(index, 1);
                Core.set("programmes", programmes);

                renderProgramme();
            });
        });
    }

    if (addProgrammeForm) {
        addProgrammeForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const titre = addProgrammeForm.titre.value.trim();
            const description = addProgrammeForm.description.value.trim();
            const date = addProgrammeForm.date.value;

            if (!titre || !date) {
                showAlert("Titre et date obligatoires");
                return;
            }

            Core.add("programmes", {
                titre,
                description,
                date
            });

            addProgrammeForm.reset();
            renderProgramme();
            showAlert(`Nouvelle activité ajoutée : ${titre}`);
        });
    }

    renderProgramme();

    /* ===============================
       GESTION DES ADMINISTRATEURS
    =============================== */

    const addAdminForm = document.getElementById("addAdminForm");
    const adminListContainer = document.getElementById("adminList");

    function renderAdmins() {

        const admins = Core.get("vp_admins");

        if (!adminListContainer) return;

        adminListContainer.innerHTML = "";

        admins.forEach(admin => {

            const card = document.createElement("div");
            card.className = "admin-card";

            card.innerHTML = `
                <strong>${admin.name}</strong><br>
                <small>${admin.email}</small><br>
                <span>${admin.role === "super-admin" ? "Haut-Admin" : "Admin"}</span>
                ${Auth.isSuperAdmin() ?
                    `<button data-id="${admin.id}" class="delete-admin">Supprimer</button>`
                    : ""
                }
            `;

            adminListContainer.appendChild(card);
        });

        attachAdminDeleteEvents();
    }

    function attachAdminDeleteEvents() {

        document.querySelectorAll(".delete-admin").forEach(btn => {
            btn.addEventListener("click", () => {

                const id = Number(btn.getAttribute("data-id"));

                if (confirm("Supprimer cet administrateur ?")) {
                    Core.remove("vp_admins", id);
                    renderAdmins();
                    updateDashboard();
                    showAlert("Administrateur supprimé");
                }
            });
        });
    }

    if (addAdminForm) {

        if (!Auth.isSuperAdmin()) {
            addAdminForm.style.display = "none";
        }

        addAdminForm.addEventListener("submit", (e) => {

            e.preventDefault();

            if (!Auth.isSuperAdmin()) {
                showAlert("Accès refusé");
                return;
            }

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const role = document.getElementById("role").value;

            if (!name || !email || !password || !role) {
                showAlert("Tous les champs sont obligatoires");
                return;
            }

            const admins = Core.get("vp_admins");

            if (admins.some(a => a.email === email)) {
                showAlert("Email déjà utilisé");
                return;
            }

            Core.add("vp_admins", { name, email, password, role });

            addAdminForm.reset();
            renderAdmins();
            updateDashboard();
            showAlert("Administrateur ajouté avec succès");
        });
    }

    renderAdmins();

    /* ===============================
   GESTION INTELLIGENTE DES DEPARTEMENTS
=============================== */

const departementContainer = document.getElementById("departementContainer");

function initializeDefaultDepartements() {

    const existing = Core.get("departements");

    if (existing.length > 0) return;

    const defaults = [

        { nom: "Protocole", type: "standard" },
        { nom: "Médias", type: "standard" },
        { nom: "Technique", type: "standard" },
        { nom: "Intercession", type: "standard" },
        { nom: "Ecodim", type: "standard" },
        { nom: "Évangélisation", type: "standard" },
        { nom: "Sœurs & Mamans", type: "standard" },

        {
            nom: "Louange & Adoration",
            type: "avec-sous-departements",
            sousDepartements: [
                { nom: "Canon Vocale" },
                { nom: "Grande Chorale" },
                { nom: "Glorel" },
                { nom: "Asafa" }
            ]
        },

        {
            nom: "Fiancailles & Mariages",
            type: "fiancailles"
        }

    ];

    Core.set("departements", defaults);
}

function renderDepartements() {

    const departements = Core.get("departements");

    if (!departementContainer) return;

    departementContainer.innerHTML = "";

    departements.forEach(dep => {

        const card = document.createElement("div");
        card.className = "stat-card";

        let content = `<h3>${dep.nom}</h3>`;
        content += `<p>Type : ${dep.type}</p>`;

        if (dep.type === "avec-sous-departements" && dep.sousDepartements) {

            content += "<ul>";

            dep.sousDepartements.forEach(sd => {
                content += `<li>- ${sd.nom}</li>`;
            });

            content += "</ul>";
        }

        if (dep.type === "fiancailles") {
            content += `<p style="color:#c62828;font-weight:bold;">Département spécial : Gestion des couples</p>`;
        }

        card.innerHTML = content;

        departementContainer.appendChild(card);
    });
}

initializeDefaultDepartements();
renderDepartements();
updateDashboard();
/* ===============================
   MODULE FIANCAILLES & MARIAGES
=============================== */

const coupleContainer = document.createElement("div");
coupleContainer.id = "coupleContainer";

const fiancaillesSection = document.getElementById("extensions"); // temporaire

if (fiancaillesSection) {
    fiancaillesSection.appendChild(coupleContainer);
}

function getCouples() {
    return Core.get("vp_couples");
}

function saveCouples(data) {
    Core.set("vp_couples", data);
}

function renderCouples() {

    const couples = getCouples();
    coupleContainer.innerHTML = "<h3>Couples enregistrés</h3>";

    if (couples.length === 0) {
        coupleContainer.innerHTML += "<p>Aucun couple enregistré.</p>";
        return;
    }

    couples.forEach(c => {

        const card = document.createElement("div");
        card.className = "admin-card";

        card.innerHTML = `
            <strong>${c.homme} & ${c.femme}</strong><br>
            <small>Statut : ${c.statut}</small><br>
            <small>Date mariage : ${c.dateMariage || "Non fixée"}</small>
            <button onclick="changeStatut(${c.id})">Changer statut</button>
        `;

        coupleContainer.appendChild(card);
    });
}

window.changeStatut = function(id) {

    const couples = getCouples();
    const couple = couples.find(c => c.id === id);

    if (!couple) return;

    const next = {
        "fiancailles": "en_preparation",
        "en_preparation": "pret_mariage",
        "pret_mariage": "maries"
    };

    couple.statut = next[couple.statut] || "maries";

    saveCouples(couples);
    renderCouples();
    Core.notify("Statut du couple mis à jour");
}

renderCouples();
/* ===============================
   MODULE COUPLES
=============================== */

(function() {

    const container = document.getElementById("couplesContainer");
    if (!container) return;

    function getCouples() {
        return Core.get("vp_couples") || [];
    }

    function saveCouples(data) {
        Core.set("vp_couples", data);
    }

    function render() {

        const couples = getCouples();
        container.innerHTML = "";

        if (couples.length === 0) {
            container.innerHTML = "<p>Aucun couple enregistré.</p>";
            return;
        }

        couples.forEach(c => {

            const card = document.createElement("div");
            card.className = "admin-card";

            card.innerHTML = `
                <h3>${c.homme?.fianceName || ""} & ${c.femme?.fianceeName || ""}</h3>
                <p>Statut : <strong>${c.statut}</strong></p>
                <button data-id="${c.id}" class="delete-btn">Supprimer</button>
            `;

            container.appendChild(card);
        });

        attachEvents();
    }

    function attachEvents() {
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => {

                const id = Number(btn.dataset.id);

                if (!confirm("Supprimer définitivement ce couple ?")) return;

                const updated = getCouples().filter(c => c.id !== id);
                saveCouples(updated);
                render();
            });
        });
    }

    render();

})();

/* ===============================
   MODULE ADHESIONS
=============================== */

const adhesionContainer = document.getElementById("adhesionTable");

function getAdhesions() {
    return Core.get("vp_adhesions") || [];
}

function saveAdhesions(data) {
    Core.set("vp_adhesions", data);
}

function getMembres() {
    return Core.get("vp_membres") || [];
}

function saveMembres(data) {
    Core.set("vp_membres", data);
}

function renderAdhesions() {

    if (!adhesionContainer) return;

    const adhesions = getAdhesions();
    adhesionContainer.innerHTML = "";

    if (adhesions.length === 0) {
        adhesionContainer.innerHTML = "<p>Aucune demande enregistrée.</p>";
        return;
    }

    adhesions.forEach(a => {

        const card = document.createElement("div");
        card.className = "admin-card";

       card.innerHTML = `
    <h3>${a.nom} ${a.prenom}</h3>
    <p><strong>Email :</strong> ${a.email}</p>
    <p><strong>Téléphone :</strong> ${a.numero || ""}</p>
    <p><strong>Adresse :</strong> ${a.adresse || ""}</p>
    <p><strong>Témoignage :</strong></p>
    <div style="background:#f3f4f6;padding:10px;border-radius:6px;margin:8px 0;">
        ${a.temoignage || "Aucun témoignage fourni."}
    </div>
    <p><strong>Statut :</strong> ${a.statut}</p>

    ${a.statut === "en_attente" ? `
        <button data-id="${a.id}" class="validate-btn">Valider</button>
        <button data-id="${a.id}" class="refuse-btn">Refuser</button>
    ` : ""}
`;

        adhesionContainer.appendChild(card);
    });

    attachAdhesionEvents();
}

function attachAdhesionEvents() {

    document.querySelectorAll(".validate-btn").forEach(btn => {
        btn.addEventListener("click", () => {

            const id = Number(btn.dataset.id);
            const adhesions = getAdhesions();
            const adhesion = adhesions.find(a => a.id === id);

            if (!adhesion) return;

            adhesion.statut = "validee";
            saveAdhesions(adhesions);

            // Création automatique membre
            const membres = getMembres();

            membres.push({
                id: Date.now(),
                nom: adhesion.nom,
                postnom: adhesion.postnom,
                prenom: adhesion.prenom,
                sexe: adhesion.sexe,
                email: adhesion.email,
                telephone: adhesion.numero || "",
                adresse: adhesion.adresse || "",
                temoignage: adhesion.temoignage || "",
                dateAdhesion: new Date().toISOString(),
                statut: "actif",
                historique: []
            });


            saveMembres(membres);

            renderAdhesions();
            updateDashboard();

            Core.notify("Adhésion validée et membre créé");
        });
    });

    document.querySelectorAll(".refuse-btn").forEach(btn => {
        btn.addEventListener("click", () => {

            const id = Number(btn.dataset.id);
            const adhesions = getAdhesions();
            const adhesion = adhesions.find(a => a.id === id);

            if (!adhesion) return;

            adhesion.statut = "refusee";
            saveAdhesions(adhesions);

            renderAdhesions();

            Core.notify("Adhésion refusée");
        });
    });
}

renderAdhesions();

/* ===============================
   MODULE MEMBRES AVANCÉ
=============================== */

const membreContainer = document.getElementById("membreTable");
const searchInput = document.getElementById("searchMembre");
const filterSelect = document.getElementById("filterStatut");
const membreCount = document.getElementById("membreCount");

function renderMembres() {

    if (!membreContainer) return;

    let membres = Core.get("vp_membres") || [];

    const searchValue = searchInput?.value.toLowerCase() || "";
    const filterValue = filterSelect?.value || "all";

    // 🔍 Recherche
    if (searchValue) {
        membres = membres.filter(m =>
            `${m.nom} ${m.prenom}`.toLowerCase().includes(searchValue)
        );
    }

    // 🎛️ Filtre statut
    if (filterValue !== "all") {
        membres = membres.filter(m => m.statut === filterValue);
    }

    membreContainer.innerHTML = "";

    if (membres.length === 0) {
        membreContainer.innerHTML = "<p>Aucun membre trouvé.</p>";
        membreCount.textContent = "";
        return;
    }

    membreCount.textContent = `${membres.length} membre(s)`;

    const table = document.createElement("table");
    table.className = "admin-table";

    table.innerHTML = `
        <thead>
            <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    membres.forEach(m => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${m.nom} ${m.prenom}</td>
            <td>${m.email}</td>
            <td>${m.telephone || ""}</td>
            <td>${new Date(m.dateAdhesion).toLocaleDateString()}</td>
            <td>
                <span class="status-badge status-${m.statut}">
                    ${m.statut}
                </span>
            </td>
            <td>
                <button data-id="${m.id}" class="toggle-status">Changer</button>
                ${
                    Auth.isSuperAdmin()
                    ? `<button data-id="${m.id}" class="delete-membre danger">Supprimer</button>`
                    : ""
                }
            </td>
        `;

        tbody.appendChild(row);
    });

    membreContainer.appendChild(table);

    attachMembreEvents();
}

function attachMembreEvents() {

    document.querySelectorAll(".toggle-status").forEach(btn => {
        btn.addEventListener("click", () => {

            const id = Number(btn.dataset.id);
            const membres = Core.get("vp_membres") || [];
            const membre = membres.find(m => m.id === id);

            const next = {
                actif: "inactif",
                inactif: "discipline",
                discipline: "actif"
            };

            membre.statut = next[membre.statut] || "actif";

            Core.set("vp_membres", membres);
            renderMembres();
            Core.notify("Statut modifié");
        });
    });

    document.querySelectorAll(".delete-membre").forEach(btn => {
        btn.addEventListener("click", () => {

            const id = Number(btn.dataset.id);

            if (!confirm("Supprimer ce membre ?")) return;

            const membres = Core.get("vp_membres") || [];
            Core.set("vp_membres", membres.filter(m => m.id !== id));

            renderMembres();
            updateDashboard();
            Core.notify("Membre supprimé");
        });
    });
}

// 🔄 Re-render automatique
searchInput?.addEventListener("input", renderMembres);
filterSelect?.addEventListener("change", renderMembres);

renderMembres();

/* ===============================
   MODULE DEPARTEMENTS
=============================== */

const membreSelect = document.getElementById("membreSelect");
const departementSelect = document.getElementById("departementSelect");
const assignBtn = document.getElementById("assignDepartement");
const departementList = document.getElementById("departementList");

function loadMembresInSelect() {

    if (!membreSelect) return;

    const membres = Core.get("vp_membres") || [];

    membreSelect.innerHTML = '<option value="">Choisir membre</option>';

    membres.forEach(m => {
        const option = document.createElement("option");
        option.value = m.id;
        option.textContent = `${m.nom} ${m.prenom}`;
        membreSelect.appendChild(option);
    });
}

function getDepartementMembers() {
    return Core.get("vp_departement_members") || [];
}

function saveDepartementMembers(data) {
    Core.set("vp_departement_members", data);
}

/* ===============================
   GESTION AFFECTATION DÉPARTEMENTS
=============================== */

document.addEventListener("DOMContentLoaded", () => {

    const departementList = document.getElementById("departementList");
    const assignBtn = document.getElementById("assignBtn");
    const membreSelect = document.getElementById("membreSelect");
    const departementSelect = document.getElementById("departementSelect");

    function renderDepartements() {

        if (!departementList) return;

        const data = getDepartementMembers();
        const membres = Core.get("vp_membres") || [];

        departementList.innerHTML = "";

        if (data.length === 0) {
            departementList.innerHTML = "<p>Aucun membre affecté.</p>";
            return;
        }

        data.forEach(d => {

            const membre = membres.find(m => m.id == d.membreId);
            if (!membre) return;

            const card = document.createElement("div");
            card.className = "admin-card";

            card.innerHTML = `
                <strong>${membre.nom} ${membre.prenom}</strong>
                <p>Département : ${d.departement}</p>
                <button data-id="${d.id}" class="remove-dept">
                    Retirer
                </button>
            `;

            departementList.appendChild(card);
        });

        document.querySelectorAll(".remove-dept").forEach(btn => {
            btn.addEventListener("click", () => {

                const id = Number(btn.dataset.id);
                const updated = getDepartementMembers().filter(d => d.id !== id);

                saveDepartementMembers(updated);
                renderDepartements();
                Core.notify("Membre retiré du département");
            });
        });
    }

    /* ===============================
       ASSIGNATION
    =============================== */

    if (assignBtn) {
        assignBtn.addEventListener("click", () => {

            const membreId = membreSelect?.value;
            const departement = departementSelect?.value;

            if (!membreId || !departement) {
                Core.notify("Sélection invalide", "error");
                return;
            }

            const data = getDepartementMembers();

            if (data.some(d =>
                d.membreId == membreId &&
                d.departement === departement
            )) {
                Core.notify("Déjà affecté à ce département");
                return;
            }

            data.push({
                id: Date.now(),
                membreId: Number(membreId),
                departement,
                dateIntegration: new Date().toISOString(),
                statut: "actif"
            });

            saveDepartementMembers(data);
            renderDepartements();
            Core.notify("Membre affecté au département");
        });
    }

    /* ===============================
       INITIALISATION
    =============================== */

    if (typeof loadMembresInSelect === "function") {
        loadMembresInSelect();
    }

    renderDepartements();

});

/* ===============================
   DEMANDES DE DEPARTEMENT
================================ */

window.approveRequest = function(id) {

    const requests = Core.get("vp_departement_requests") || [];
    const members = Core.get("vp_departement_members") || [];

    const req = requests.find(r => r.id === id);
    if (!req) return;

    if (members.some(m =>
        m.email === req.email &&
        m.departement === req.departement &&
        m.sousDepartement === req.sousDepartement
    )) {
        Core.notify("Déjà membre de ce département");
        return;
    }

    req.statut = "accepte";

    members.push({
        id: Date.now(),
        nom: req.nom,
        email: req.email,
        departement: req.departement,
        sousDepartement: req.sousDepartement,
        dateIntegration: new Date().toISOString()
    });

    Core.set("vp_departement_requests", requests);
    Core.set("vp_departement_members", members);

    Core.notify("Demande acceptée");

    renderDepartementRequests();
    renderStats();
};
window.rejectRequest = function(id) {

    const requests = Core.get("vp_departement_requests") || [];
    const req = requests.find(r => r.id === id);
    if (!req) return;

    req.statut = "refuse";

    Core.set("vp_departement_requests", requests);

    Core.notify("Demande refusée");

    renderDepartementRequests();
    renderStats();
};
});
function renderDepartementRequests() {

    const container = document.getElementById("departementRequestsContainer");
    if (!container) return;

    const requests = Core.get("vp_departement_requests") || [];
    container.innerHTML = "";

    if (!requests.length) {
        container.innerHTML = "<p>Aucune demande enregistrée.</p>";
        return;
    }

    const grouped = {};

    requests.forEach(r => {

        if (!grouped[r.departement]) {
            grouped[r.departement] = {};
        }

        const sous = r.sousDepartement || "Général";

        if (!grouped[r.departement][sous]) {
            grouped[r.departement][sous] = [];
        }

        grouped[r.departement][sous].push(r);
    });

    Object.keys(grouped).forEach(dept => {

        const deptBlock = document.createElement("div");
        deptBlock.className = "dept-block";
        deptBlock.innerHTML = `<h3>${dept}</h3>`;

        Object.keys(grouped[dept]).forEach(sous => {

            const sousBlock = document.createElement("div");
            sousBlock.style.marginLeft = "20px";
            sousBlock.innerHTML = `<h4>${sous}</h4>`;

            grouped[dept][sous].forEach(req => {

                const card = document.createElement("div");
                card.className = "admin-card";

                card.innerHTML = `
                    <strong>${req.nom}</strong><br>
                    <small>${req.email}</small><br>
                    <span>Statut : ${req.statut}</span>
                    <div style="margin-top:8px;">
                        <button onclick="approveRequest(${req.id})">Accepter</button>
                        <button onclick="rejectRequest(${req.id})">Refuser</button>
                    </div>
                `;

                sousBlock.appendChild(card);
            });

            deptBlock.appendChild(sousBlock);
        });

        container.appendChild(deptBlock);
    });
}
let deptChartInstance = null;

function renderStats() {

    const members = Core.get("vp_departement_members") || [];
    const requests = Core.get("vp_departement_requests") || [];

    const statsContainer = document.getElementById("statsContainer");
    if (!statsContainer) return;

    const totalMembers = members.length;
    const pendingRequests = requests.filter(r => r.statut === "en_attente").length;

    const deptCount = {};

    members.forEach(m => {
        deptCount[m.departement] = (deptCount[m.departement] || 0) + 1;
    });

    statsContainer.innerHTML = `
        <div class="stat-card">Total membres : ${totalMembers}</div>
        <div class="stat-card">Demandes en attente : ${pendingRequests}</div>
    `;

    const canvas = document.getElementById("deptChart");
    if (!canvas) return;

    if (deptChartInstance) {
        deptChartInstance.destroy();
    }

    deptChartInstance = new Chart(canvas, {
        type: "bar",
        data: {
            labels: Object.keys(deptCount),
            datasets: [{
                label: "Membres par département",
                data: Object.values(deptCount)
            }]
        },
        options: {
            responsive: true
        }
    });
}
/* domcontentloaded pour s'assurer que les éléments sont chargés avant d'attacher les événements */
document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       PROTECTION SUPER ADMIN
    =============================== */

    Auth.protectPage();
    loadWeeklyVerses();
    loadTopVerses();
    renderVerseLikesChart();

    const user = Auth.currentUser();

    if (!user || user.role !== "super-admin") {
        alert("Accès réservé aux Hauts-Administrateurs");
        window.location.href = "Bureau-pastorale.html";
        return;
    }

    /* ===============================
       EXPORT CSV
    =============================== */

    document.getElementById("exportDeptMembers")?.addEventListener("click", () => {
        const data = Core.get("vp_departement_members") || [];
        downloadCSV("membres_departements.csv", data);
    });

    document.getElementById("exportDeptRequests")?.addEventListener("click", () => {
        const data = Core.get("vp_departement_requests") || [];
        downloadCSV("demandes_departements.csv", data);
    });

    document.getElementById("exportChurchMembers")?.addEventListener("click", () => {
        const data = Core.get("vp_members") || [];
        downloadCSV("membres_eglise.csv", data);
    });

    document.getElementById("exportCouples")?.addEventListener("click", () => {
        const data = Core.get("vp_couples") || [];
        downloadCSV("couples.csv", data);
    });

    /* ===============================
       RENDERS
    =============================== */

    renderDepartementMedia();
    renderDepartementRequests();
    renderStats();

});
function downloadCSV(filename, data) {

    if (!data.length) {
        Core.notify("Aucune donnée à exporter");
        return;
    }

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(obj =>
        Object.values(obj).map(val => `"${val}"`).join(",")
    );

    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
document.getElementById("saveDeptBtn")?.addEventListener("click", () => {

    const name = document.getElementById("deptName").value.trim();
    const presidentName = document.getElementById("presidentName").value.trim();
    const presidentPhoto = document.getElementById("presidentPhoto").value.trim();
    const presidentDesc = document.getElementById("presidentDesc").value.trim();

    if (!name) {
        Core.notify("Nom du département requis");
        return;
    }

    const data = Core.get("vp_departements_media") || [];

    const existing = data.find(d => d.departement === name);

    if (existing) {
        existing.president = {
            nom: presidentName,
            photo: presidentPhoto,
            description: presidentDesc
        };
    } else {
        data.push({
            departement: name,
            president: {
                nom: presidentName,
                photo: presidentPhoto,
                description: presidentDesc
            },
            images: [],
            videos: [],
            sousDepartements: []
        });
    }

    Core.set("vp_departements_media", data);
    Core.notify("Département enregistré");

    renderDepartementMedia();
});
function renderDepartementMedia() {

    const container = document.getElementById("departementMediaList");
    if (!container) return;

    const data = Core.get("vp_departements_media") || [];
    container.innerHTML = "";

    data.forEach(d => {

        const div = document.createElement("div");
        div.className = "admin-card";

        div.innerHTML = `
            <strong>${d.departement}</strong><br>
            Président: ${d.president?.nom || "Non défini"}
            <div>
                <button onclick="deleteDept('${d.departement}')">Supprimer</button>
            </div>
        `;

        container.appendChild(div);
    });
}

window.deleteDept = function(name) {

    let data = Core.get("vp_departements_media") || [];
    data = data.filter(d => d.departement !== name);

    Core.set("vp_departements_media", data);
    Core.notify("Département supprimé");

    renderDepartementMedia();
};
function renderDepartementMedia() {

    const container = document.getElementById("departementMediaList");
    if (!container) return;

    const data = Core.get("vp_departements_media") || [];
    container.innerHTML = "";

    data.forEach(d => {

        const div = document.createElement("div");
        div.className = "admin-card";

        div.innerHTML = `
            <strong>${d.departement}</strong><br>
            Président: ${d.president?.nom || "Non défini"}
            <div>
                <button onclick="deleteDept('${d.departement}')">Supprimer</button>
            </div>
        `;

        container.appendChild(div);
    });
}

window.deleteDept = function(name) {

    let data = Core.get("vp_departements_media") || [];
    data = data.filter(d => d.departement !== name);

    Core.set("vp_departements_media", data);
    Core.notify("Département supprimé");

    renderDepartementMedia();
};
/* ===============================
   MAP ADMIN
=============================== */

let adminMap = null;
let selectedLatLng = null;

function initAdminMap() {

    if (adminMap) {
        adminMap.invalidateSize();
        return;
    }

    adminMap = L.map('mapAdmin').setView([-11.6647, 27.4794], 13);

    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '© OpenStreetMap' }
    ).addTo(adminMap);

    const mereIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [35, 35]
    });

    const extensionIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
        iconSize: [30, 30]
    });

    renderLocations(mereIcon, extensionIcon);

    adminMap.on('click', e => {
        selectedLatLng = e.latlng;
        L.marker(e.latlng).addTo(adminMap);
    });

    document.getElementById("saveLocation")
        ?.addEventListener("click", () => {

        if (!selectedLatLng) {
            Core.notify("Cliquez sur la carte", "error");
            return;
        }

        const data = Core.get("vp_locations") || [];

        data.push({
            id: Date.now(),
            nom: document.getElementById("locName").value,
            type: document.getElementById("locType").value,
            latitude: selectedLatLng.lat,
            longitude: selectedLatLng.lng
        });

        Core.set("vp_locations", data);

        Core.notify("Assemblée ajoutée");

        adminMap.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                adminMap.removeLayer(layer);
            }
        });

        renderLocations(mereIcon, extensionIcon);
    });
}

function renderLocations(mereIcon, extensionIcon) {

    const locations = Core.get("vp_locations") || [];

    locations.forEach(loc => {
        L.marker(
            [loc.latitude, loc.longitude],
            { icon: loc.type === "mere" ? mereIcon : extensionIcon }
        )
        .addTo(adminMap)
        .bindPopup(`<b>${loc.nom}</b>`);
    });
}
document.getElementById("youthAdminBtn")
?.addEventListener("click", () => {

    const user = Auth.currentUser();

    if (!user) {
        alert("Veuillez vous connecter");
        return;
    }

    if (
        user.role === "youth-super-admin" ||
        user.role === "youth-admin"
    ) {
        window.location.href = "jeunesse-admin.html";
    } else {
        alert("Accès réservé à l'administration jeunesse");
    }

});
function loadWeeklyVerses() {

    const container = document.getElementById("verseList");
    if (!container) return;

    const verses = Core.get("vp_weekly_verses") || [];

    container.innerHTML = "";

    verses.forEach(v => {

        const div = document.createElement("div");
        div.className = "bg-gray-50 p-3 rounded mb-2 flex justify-between items-center";

        div.innerHTML = `
            <div>
                <strong>${v.reference}</strong>
                <p class="text-sm text-gray-600">${v.texte}</p>
            </div>
            <button onclick="deleteVerse(${v.id})"
                class="bg-red-600 text-white px-3 py-1 rounded">
                Supprimer
            </button>
        `;

        container.appendChild(div);
    });
}

document.getElementById("addVerseBtn")
?.addEventListener("click", () => {

    const reference = document.getElementById("verseReferenceInput").value.trim();
    const texte = document.getElementById("verseTextInput").value.trim();

    if (!reference || !texte) {
        alert("Tous les champs sont requis");
        return;
    }

    const verses = Core.get("vp_weekly_verses") || [];

    // 🔥 CONDITION MAX 7
    if (verses.length >= 7) {
        alert("Maximum 7 versets autorisés.");
        return;
    }

    verses.push({
        id: Date.now(),
        reference,
        texte
    });

    Core.set("vp_weekly_verses", verses);

    document.getElementById("verseReferenceInput").value = "";
    document.getElementById("verseTextInput").value = "";

    loadWeeklyVerses();
});

window.deleteVerse = function(id) {

    let verses = Core.get("vp_weekly_verses") || [];
    verses = verses.filter(v => v.id !== id);

    Core.set("vp_weekly_verses", verses);

    loadWeeklyVerses();
};
function loadTopVerses() {

    const container = document.getElementById("topVerses");
    if (!container) return;

    const likes = Core.get("vp_verse_likes") || [];
    const verses = Core.get("vp_weekly_verses") || [];

    const sorted = [...likes].sort((a, b) => b.likes - a.likes);

    container.innerHTML = "";

    sorted.slice(0, 3).forEach((l, index) => {

        const verse = verses.find(v => v.id === l.verseId);
        if (!verse) return;

        const div = document.createElement("div");
        div.className = "mb-3 p-3 bg-gray-50 rounded";

        div.innerHTML = `
            <strong>#${index + 1} - ${verse.reference}</strong>
            <p class="text-sm">${verse.texte}</p>
            <p class="text-pink-600 font-semibold">
                ❤️ ${l.likes} likes
            </p>
        `;

        container.appendChild(div);
    });
}
function renderVerseLikesChart() {

    const likes = Core.get("vp_verse_likes") || [];
    const verses = Core.get("vp_weekly_verses") || [];

    const labels = [];
    const dataValues = [];

    likes.forEach(l => {

        const verse = verses.find(v => v.id === l.verseId);
        if (!verse) return;

        labels.push(verse.reference);
        dataValues.push(l.likes);
    });

    const ctx = document.getElementById("verseLikesChart");
    if (!ctx) return;

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Nombre de Likes",
                data: dataValues,
                backgroundColor: "#7c3aed"
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
}