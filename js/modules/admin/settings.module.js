const SettingsModule = {

    async init() {
        console.log("SettingsModule chargé");

        this.bindGeneral();
        this.bindAdmins();
        this.bindDepartements();
        this.bindTheme();
        this.bindReset();
    },

    /* ===============================
       INFOS GENERALES
    =============================== */

    bindGeneral() {

        document.getElementById("saveGeneral")
            ?.addEventListener("click", async () => {

                const name =
                    document.getElementById("churchName").value;

                const address =
                    document.getElementById("churchAddress").value;

                const email =
                    document.getElementById("churchEmail").value;

                await supabaseClient
                    .from("settings")
                    .upsert([{
                        id: 1,
                        name,
                        address,
                        email
                    }]);

                alert("Informations sauvegardées ✅");
            });
    },

    /* ===============================
       ADMINS
    =============================== */

    bindAdmins() {

        document.getElementById("addAdmin")
            ?.addEventListener("click", async () => {

                const name =
                    document.getElementById("adminNameInput").value;

                const role =
                    document.getElementById("adminRoleInput").value;

                await supabaseClient
                    .from("admins")
                    .insert([{
                        name,
                        role
                    }]);

                alert("Admin ajouté ✅");
            });
    },

    /* ===============================
       DEPARTEMENTS
    =============================== */

    bindDepartements() {

        document.getElementById("saveDeptBtn")
            ?.addEventListener("click", async () => {

                const nom =
                    document.getElementById("deptName").value;

                const president =
                    document.getElementById("presidentName").value;

                const description =
                    document.getElementById("presidentDesc").value;

                await supabaseClient
                    .from("departements")
                    .insert([{
                        nom,
                        president,
                        description
                    }]);

                alert("Département ajouté ✅");
            });
    },

    /* ===============================
       THEME
    =============================== */

    bindTheme() {

        document.getElementById("saveTheme")
            ?.addEventListener("click", () => {

                const color =
                    document.getElementById("primaryColor").value;

                document.documentElement
                    .style.setProperty("--primary", color);

                localStorage.setItem("themeColor", color);

                alert("Thème appliqué 🎨");
            });

        // Charger thème
        const saved =
            localStorage.getItem("themeColor");

        if (saved) {
            document.documentElement
                .style.setProperty("--primary", saved);
        }
    },

    /* ===============================
       RESET SYSTEME
    =============================== */

    bindReset() {

        document.getElementById("resetSystem")
            ?.addEventListener("click", async () => {

                if (!confirm("⚠️ Réinitialiser tout le système ?")) return;

                await supabaseClient.from("church_members").delete().neq("id", 0);
                await supabaseClient.from("adhesion_requests").delete().neq("id", 0);
                await supabaseClient.from("couples").delete().neq("id", 0);

                alert("Système réinitialisé ❗");
            });
    }

};