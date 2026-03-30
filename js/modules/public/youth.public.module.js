const YouthPublic = {

    init() {
        console.log("YouthPublic chargé");
        this.bindForm();
    },

    bindForm() {

        const form =
            document.getElementById("adhesionForm");

        if (!form) return;

        form.addEventListener("submit", async (e) => {

            e.preventDefault();

            const nomInput =
                document.getElementById("adhesionNom");

            const emailInput =
                document.getElementById("adhesionEmail");

            const sexeInput =
                document.getElementById("adhesionSexe");

            const phoneInput =
                document.getElementById("adhesionTelephone");

            const motivationInput =
                document.getElementById("adhesionMotivation");

            if (!nomInput || !emailInput || !sexeInput || !phoneInput || !motivationInput) {
                console.error("Un champ du formulaire est introuvable");
                return;
            }

            const nom = nomInput.value.trim();
            const email = emailInput.value.trim();
            const sexe = sexeInput.value;
            const phone = phoneInput.value.trim();
            const motivation = motivationInput.value.trim();

            if (!nom || !email || !sexe || !phone || !motivation) {
                alert("Tous les champs sont obligatoires");
                return;
            }

            /* ===============================
               INSERTION SUPABASE
            =============================== */

            const { error } =
                await supabaseClient
                    .from("youth_requests")
                    .insert([
                        {
                            nom,
                            email,
                            sexe,
                            telephone: phone,
                            motivation,
                            statut: "en_attente"
                        }
                    ]);

            if (error) {
                console.error("Erreur Supabase :", error);
                alert("Erreur lors de l'envoi");
                return;
            }

            alert("Demande envoyée avec succès 💜");

            form.reset();

            const modal =
                document.getElementById("adhesionModal");

            modal?.classList.add("hidden");

        });

    }

};