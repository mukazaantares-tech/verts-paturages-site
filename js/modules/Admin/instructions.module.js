const InstructionsModule = {

    async init() {
        console.log("InstructionsModule chargé");

        this.bindPublish();
        await this.render();
    },

    /* ===============================
       PUBLIER
    =============================== */

    bindPublish() {

        document.getElementById("publishInstruction")
            ?.addEventListener("click", async () => {

                const titre =
                    document.getElementById("instructionTitle").value.trim();

                const contenu =
                    document.getElementById("instructionContent").value.trim();

                if (!titre || !contenu) {
                    alert("Champs obligatoires");
                    return;
                }

                await supabaseClient
                    .from("instructions")
                    .insert([{
                        titre,
                        contenu
                    }]);

                alert("Instruction publiée ✅");

                document.getElementById("instructionTitle").value = "";
                document.getElementById("instructionContent").value = "";

                this.render();
            });
    },

    /* ===============================
       AFFICHAGE
    =============================== */

    async render() {

        const container =
            document.getElementById("instructionList");

        if (!container) return;

        const { data, error } =
            await supabaseClient
                .from("instructions")
                .select("*")
                .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        container.innerHTML = "";

        data.forEach(i => {

            const div = document.createElement("div");

            div.className = "adhesion-card";

            div.innerHTML = `
                <strong>${i.titre}</strong>
                <p>${i.contenu}</p>

                <button onclick="InstructionsModule.delete(${i.id})">
                    🗑 Supprimer
                </button>
            `;

            container.appendChild(div);
        });
    },

    /* ===============================
       SUPPRIMER
    =============================== */

    async delete(id) {

        if (!confirm("Supprimer cette instruction ?")) return;

        await supabaseClient
            .from("instructions")
            .delete()
            .eq("id", id);

        this.render();
    }

};