const YouthDashboard = {

    init() {
        this.renderStats();
        this.renderChart();
    },

    renderStats() {

        const members =
            DataService.get("vp_youth_members") || [];

        const requests =
            DataService.get("vp_youth_requests") || [];

        const activities =
            DataService.get("vp_jeunesse_activities") || [];

        document.getElementById("statMembers").textContent =
            members.length;

        document.getElementById("statPending").textContent =
            requests.filter(r => r.statut === "en_attente").length;

        document.getElementById("statActivities").textContent =
            activities.length;
    },

    renderChart() {

        const members =
            DataService.get("vp_youth_members") || [];

        const months = {};

        members.forEach(m => {
            const d = new Date(m.dateIntegration);
            const key =
                d.getFullYear() + "-" + (d.getMonth() + 1);

            months[key] = (months[key] || 0) + 1;
        });

        const ctx =
            document.getElementById("youthChart");

        if (!ctx) return;

        new Chart(ctx, {
            type: "line",
            data: {
                labels: Object.keys(months),
                datasets: [{
                    label: "Évolution membres",
                    data: Object.values(months),
                    borderColor: "#7e22ce",
                    fill: false
                }]
            }
        });
    }

};