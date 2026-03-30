const FormManager = {

    init() {
        this.bindAllForms();
    },

    bindAllForms() {

        const forms = document.querySelectorAll("form[data-table]");

        forms.forEach(form => {

            form.addEventListener("submit", async (e) => {

                e.preventDefault();

                const table = form.dataset.table;
                const source = form.dataset.source || "inconnu";

                const formData = new FormData(form);
                const data = {};

                formData.forEach((value, key) => {
                    data[key] = value.trim();
                });

                // ajouter metadata
                data.source = source;
                data.statut = "nouveau";

                const { error } = await supabaseClient
                    .from(table)
                    .insert([data]);

                if (error) {
                    console.error("Erreur Supabase :", error);
                    alert("Erreur lors de l'envoi ❌");
                    return;
                }

                alert("Demande envoyée avec succès ✅");

                form.reset();

                // fermer modal si existe
                const modal = form.closest(".fixed");
                if (modal) modal.classList.add("hidden");

            });

        });

    }

};