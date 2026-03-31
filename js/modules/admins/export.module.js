const ExportModule = {

    init() {
        this.initExportButtons();
    },

    initExportButtons() {

        this.bindExport(
            "exportDeptMembers",
            "vp_departement_members",
            "membres_departements.csv"
        );

        this.bindExport(
            "exportDeptRequests",
            "vp_departement_requests",
            "demandes_departements.csv"
        );

        this.bindExport(
            "exportChurchMembers",
            "vp_members",
            "membres_eglise.csv"
        );

        this.bindExport(
            "exportCouples",
            "vp_couples",
            "couples.csv"
        );
    },

    bindExport(buttonId, key, filename) {

        const btn = document.getElementById(buttonId);
        if (!btn) return;

        btn.addEventListener("click", () => {

            const data = DataService.get(key) || [];

            if (!data.length) {
                alert("Aucune donnée à exporter");
                return;
            }

            const headers =
                Object.keys(data[0]).join(",");

            const rows =
                data.map(obj =>
                    Object.values(obj)
                        .map(v => `"${v}"`)
                        .join(",")
                );

            const csv =
                [headers, ...rows].join("\n");

            const blob =
                new Blob([csv], { type: "text/csv" });

            const link =
                document.createElement("a");

            link.href =
                URL.createObjectURL(blob);

            link.download = filename;
            link.click();
        });
    }

};