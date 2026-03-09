const YouthAdhesions = {

    init() {
        this.render();
    },

    render() {

        const container =
            document.getElementById("adhesionList");

        if (!container) return;

        const requests =
            DataService.get("vp_youth_requests") || [];

        container.innerHTML = "";

        requests
            .filter(r => r.statut === "en_attente")
            .forEach(r => {

                const div =
                    document.createElement("div");

                div.className =
                    "bg-white p-4 rounded shadow mb-3";

                div.innerHTML = `
                    <strong>${r.nom}</strong>
                    <p>${r.email}</p>
                    <button onclick="YouthAdhesions.approve(${r.id})"
                        class="bg-green-600 text-white px-3 py-1 rounded">
                        Accepter
                    </button>
                `;

                container.appendChild(div);
            });
    },

    approve(id) {

        const requests =
            DataService.get("vp_youth_requests") || [];

        const members =
            DataService.get("vp_youth_members") || [];

        const req =
            requests.find(r => r.id === id);

        if (!req) return;

        members.push({
            id: Date.now(),
            nom: req.nom,
            email: req.email,
            sexe: req.sexe,
            dateIntegration: new Date().toISOString(),
            statut: "actif"
        });

        req.statut = "accepte";

        DataService.set("vp_youth_members", members);
        DataService.set("vp_youth_requests", requests);

        this.render();
        YouthDashboard.renderStats();
    }

};