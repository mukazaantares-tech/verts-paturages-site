const ReportsModule = {

    async init() {
        console.log("ReportsModule chargé");

        await this.renderStats();
        await this.renderChart();
        this.bindExport();
    },

    /* ===============================
       STATS TEXTUELLES
    =============================== */

    async renderStats() {

        const container =
            document.getElementById("statsContainer");

        if (!container) return;

        const { data: membres } =
            await supabaseClient.from("church_members").select("*");

        const { data: adhesions } =
            await supabaseClient.from("adhesion_requests").select("*");

        const { data: couples } =
            await supabaseClient.from("couples").select("*");

        container.innerHTML = `
            <div class="stat-card">
                <h3>Membres</h3>
                <p>${membres?.length || 0}</p>
            </div>

            <div class="stat-card">
                <h3>Adhésions</h3>
                <p>${adhesions?.length || 0}</p>
            </div>

            <div class="stat-card">
                <h3>Couples</h3>
                <p>${couples?.length || 0}</p>
            </div>
        `;
    },

    /* ===============================
       GRAPHIQUE
    =============================== */

    async renderChart() {

        const ctx = document.getElementById("deptChart");
        if (!ctx) return;

        const { data: membres } =
            await supabaseClient.from("church_members").select("*");

        const repartition = {};

        membres?.forEach(m => {

            const dept = m.departement || "Sans département";

            repartition[dept] =
                (repartition[dept] || 0) + 1;
        });

        new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(repartition),
                datasets: [{
                    data: Object.values(repartition)
                }]
            }
        });
    },

    /* ===============================
       EXPORT
    =============================== */

    bindExport() {

        document.getElementById("exportChurchMembers")
            ?.addEventListener("click", () =>
                this.exportTable("church_members")
            );

        document.getElementById("exportDeptMembers")
            ?.addEventListener("click", () =>
                this.exportTable("departements")
            );

        document.getElementById("exportDeptRequests")
            ?.addEventListener("click", () =>
                this.exportTable("adhesion_requests")
            );

        document.getElementById("exportCouples")
            ?.addEventListener("click", () =>
                this.exportTable("couples")
            );
    },

    async exportTable(table) {

        const { data, error } =
            await supabaseClient.from(table).select("*");

        if (error) {
            console.error(error);
            return;
        }

        const csv = this.convertToCSV(data);

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = table + ".csv";
        a.click();
    },

    convertToCSV(data) {

        if (!data || data.length === 0) return "";

        const keys = Object.keys(data[0]);

        const rows = data.map(obj =>
            keys.map(k => `"${obj[k] || ""}"`).join(",")
        );

        return [
            keys.join(","),
            ...rows
        ].join("\n");
    }

};