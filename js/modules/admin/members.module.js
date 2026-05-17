const AdhesionsModule = {

    async init() {
        console.log("AdhesionsModule chargé");

        this.bindEvents();
        await this.render();
    },

    bindEvents() {

        const filter =
            document.getElementById("filterAdhesions");

        filter?.addEventListener("change", () => this.render());
    },

    /* ===============================
       RENDER
    =============================== */

    async render() {

        const container =
            document.getElementById("adhesionTable");

        if (!container) return;

        const filter =
            document.getElementById("filterAdhesions")?.value || "all";

        let query =
            supabaseClient
                .from("adhesion_requests")
                .select("*")
                .order("created_at", { ascending: false });

        if (filter !== "all") {
            query = query.eq("statut", filter);
        }

        const { data: adhesions, error } = await query;

        if (error) {
            console.error("Erreur adhesions :", error);
            return;
        }

        container.innerHTML = "";

        if (!adhesions || adhesions.length === 0) {
            container.innerHTML = "<p>Aucune demande</p>";
            return;
        }

        adhesions.forEach(a => {

            const div = document.createElement("div");

            div.className = "adhesion-card";

            div.innerHTML = `
                <strong>${a.nom || ""} ${a.postnom || ""}</strong>
                <p>${a.email || ""}</p>
                <p>${a.numero || ""}</p>

                <div class="adhesion-text">
                    ${a.motivation || a.temoignage || "Pas de message"}
                </div>

                <small>Statut : ${a.statut}</small>

                <div class="adhesion-actions">
                    ${a.statut === "en_attente" ? `
                        <button onclick="AdhesionsModule.approve(${a.id})">
                            ✅ Accepter
                        </button>

                        <button onclick="AdhesionsModule.reject(${a.id})">
                            ❌ Refuser
                        </button>
                    ` : ""}
                </div>
            `;

            container.appendChild(div);
        });

    },

    /* ===============================
       ACCEPTER
    =============================== */

    async approve(id) {

        const { data: req, error } =
            await supabaseClient
                .from("adhesion_requests")
                .select("*")
                .eq("id", id)
                .single();

        if (error || !req) {
            console.error("Erreur récupération :", error);
            return;
        }

        // 🔥 Ajouter membre
        const { error: insertError } =
            await supabaseClient
                .from("church_members")
                .insert([{
                    nom: req.nom,
                    postnom: req.postnom,
                    prenom: req.prenom,
                    email: req.email,
                    numero: req.numero,
                    sexe: req.sexe,
                    adresse_physique: req.adresse_physique,
                    statut: "actif",
                    source: req.source
                }]);

        if (insertError) {
            console.error("Erreur ajout membre :", insertError);
            return;
        }

        // 🔥 Update statut
        await supabaseClient
            .from("adhesion_requests")
            .update({ statut: "accepte" })
            .eq("id", id);

        alert("Membre ajouté ✅");

        this.render();

        if (typeof MembersModule !== "undefined")
            MembersModule.render();

        if (typeof DashboardModule !== "undefined")
            DashboardModule.renderStats();
    },

    /* ===============================
       REFUSER
    =============================== */

    async reject(id) {

        await supabaseClient
            .from("adhesion_requests")
            .update({ statut: "refuse" })
            .eq("id", id);

        alert("Demande refusée ❌");

        this.render();
    }

};