const DashboardModule = {

    init() {
        this.loadStats();
    },

    loadStats() {

        const members =
            DataService.getYouthMembers();

        const requests =
            DataService.get("vp_youth_requests") || [];

        document.getElementById("statMembers").textContent =
            members.length;

        document.getElementById("statPending").textContent =
            requests.filter(r => r.statut === "en_attente").length;
    }

};