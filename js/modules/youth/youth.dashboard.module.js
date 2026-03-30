const YouthDashboard = {

    async init() {
        await this.renderStats();
        await this.renderChart();
    },

    async renderStats() {

        /* ===============================
           MEMBRES (SUPABASE)
        =============================== */

        const { data: members, error } =
            await supabaseClient
                .from("youth_members")
                .select("*");

        if (error) {
            console.error("Erreur chargement membres :", error);
        }

        /* ===============================
           DEMANDES (LOCAL TEMPORAIRE)
        =============================== */

        const requests =
            DataService.get("vp_youth_requests") || [];

        /* ===============================
           ACTIVITES (LOCAL TEMPORAIRE)
        =============================== */

        const activities =
            DataService.get("vp_jeunesse_activities") || [];

        /* ===============================
           DOM ELEMENTS
        =============================== */

        const statMembers =
            document.getElementById("statMembers");

        const statPending =
            document.getElementById("statPending");

        const statActivities =
            document.getElementById("statActivities");

        if (statMembers) {
            statMembers.textContent =
                members ? members.length : 0;
        }

        if (statPending) {
            statPending.textContent =
                requests.filter(r => r.statut === "en_attente").length;
        }

        if (statActivities) {
            statActivities.textContent =
                activities.length;
        }
    },

    async renderChart() {

        const { data: members, error } =
            await supabaseClient
                .from("youth_members")
                .select("*");

        if (error) {
            console.error("Erreur graphique :", error);
            return;
        }

        if (!members || members.length === 0) return;

        const months = {};

        members.forEach(m => {

            const d =
                new Date(m.created_at || m.dateIntegration);

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