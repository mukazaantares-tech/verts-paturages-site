const CouplesModule = {

    async init() {
        console.log("CouplesModule chargé");
        await this.render();
    },

    async render() {

        const container =
            document.getElementById("couplesContainer");

        if (!container) return;

        const { data: couples, error } =
            await supabaseClient
                .from("couples")
                .select("*")
                .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        container.innerHTML = "";

        couples.forEach(c => {

            const div = document.createElement("div");

            div.className = "adhesion-card";

            div.innerHTML = `
                <h3>💍 Couple</h3>

                <div class="adhesion-text">
                    <strong>Fiancé :</strong> ${c.fiance_nom} ${c.fiance_postnom}<br>
                    📧 ${c.fiance_email} <br>
                    📞 ${c.fiance_phone}
                </div>

                <div class="adhesion-text">
                    <strong>Fiancée :</strong> ${c.fiancee_nom} ${c.fiancee_postnom}<br>
                    📧 ${c.fiancee_email} <br>
                    📞 ${c.fiancee_phone}
                </div>

                <p><strong>Statut :</strong> ${c.statut}</p>

                <div class="adhesion-actions">

                    <button onclick="CouplesModule.approve(${c.id})">
                        ✅ Valider
                    </button>

                    <button onclick="CouplesModule.reject(${c.id})">
                        ❌ Refuser
                    </button>

                    <button onclick="CouplesModule.delete(${c.id})">
                        🗑 Supprimer
                    </button>

                </div>
            `;

            container.appendChild(div);
        });

    },

    /* ===============================
       VALIDER
    =============================== */

    async approve(id) {

        await supabaseClient
            .from("couples")
            .update({ statut: "valide" })
            .eq("id", id);

        alert("Couple validé 💍");

        this.render();
    },

    /* ===============================
       REFUSER
    =============================== */

    async reject(id) {

        await supabaseClient
            .from("couples")
            .update({ statut: "refuse" })
            .eq("id", id);

        alert("Couple refusé ❌");

        this.render();
    },

    /* ===============================
       SUPPRIMER
    =============================== */

    async delete(id) {

        if (!confirm("Supprimer ce couple ?")) return;

        await supabaseClient
            .from("couples")
            .delete()
            .eq("id", id);

        this.render();
    }

};