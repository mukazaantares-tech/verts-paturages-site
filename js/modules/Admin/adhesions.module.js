const AdhesionsModule = {

    async init() {
        console.log("AdhesionsModule chargé");

        await this.render();
        this.bindFilters();
    },

    /* ===============================
       AFFICHAGE
    =============================== */

    async render(filter = "en_attente") {

        const container =
            document.getElementById("adhesionTable");

        if (!container) return;

        let query =
            supabaseClient
                .from("adhesion_requests")
                .select("*")
                .order("created_at", { ascending: false });

        // 🔥 filtre dynamique
        if (filter !== "all") {
            query = query.eq("statut", filter);
        }

        const { data: adhesions, error } = await query;

        if (error) {
            console.error(error);
            container.innerHTML = "Erreur chargement ❌";
            return;
        }

        container.innerHTML = "";

        if (!adhesions || adhesions.length === 0) {
            container.innerHTML = "Aucune demande";
            return;
        }

        adhesions.forEach(a => {

            const div = document.createElement("div");

            div.className = "adhesion-card";

            div.innerHTML = `
                <strong>${a.nom || ""} ${a.postnom || ""}</strong>
                <p>${a.email || ""}</p>
                <p>${a.telephone || a.numero || ""}</p>

                <div class="adhesion-text">
                    ${a.motivation || a.temoignage || ""}
                </div>

                <small>
                    ${a.source || ""}
                    - ${a.statut || "en_attente"}
                </small>

                <div class="adhesion-actions">

                    ${
                        a.statut === "en_attente"
                        ? `
                        <button onclick="AdhesionsModule.approve(${a.id})">
                            ✅ Accepter
                        </button>

                        <button onclick="AdhesionsModule.reject(${a.id})">
                            ❌ Refuser
                        </button>
                        `
                        : ""
                    }

                    <button onclick="AdhesionsModule.delete(${a.id})"
                        style="background:red;color:white;">
                        🗑 Supprimer
                    </button>

                </div>
            `;

            container.appendChild(div);
        });
    },

    /* ===============================
       FILTRES
    =============================== */

    bindFilters() {

        const select =
            document.getElementById("filterAdhesions");

        if (!select) return;

        select.addEventListener("change", () => {
            this.render(select.value);
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
            console.error(error);
            return;
        }

        // 🔥 Ajouter dans membres
        const { error: insertError } =
            await supabaseClient
                .from("church_members")
                .insert([{
                    nom: req.nom,
                    postnom: req.postnom,
                    prenom: req.prenom,
                    email: req.email,
                    numero: req.telephone || req.numero,
                    sexe: req.sexe,
                    adresse_physique: req.adresse_physique,
                    statut: "actif",
                    source: req.source
                }]);

        if (insertError) {
            console.error(insertError);
            alert("Erreur ajout membre ❌");
            return;
        }

        // 🔥 Mise à jour statut
        await supabaseClient
            .from("adhesion_requests")
            .update({ statut: "accepte" })
            .eq("id", id);

        alert("Membre ajouté ✅");

        await this.render();
        DashboardModule?.renderStats();
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

        await this.render();
    },

    /* ===============================
       SUPPRESSION
    =============================== */

    async delete(id) {

        if (!confirm("Supprimer cette demande ?")) return;

        const { error } =
            await supabaseClient
                .from("adhesion_requests")
                .delete()
                .eq("id", id);

        if (error) {
            console.error(error);
            alert("Erreur suppression ❌");
            return;
        }

        alert("Supprimé ✅");

        await this.render();
    }

};

// 🔥 IMPORTANT pour onclick
window.AdhesionsModule = AdhesionsModule;