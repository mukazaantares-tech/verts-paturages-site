const ProgrammeModule = {

    async init() {
        console.log("ProgrammeModule chargé");

        this.bindForm();
        await this.render();
    },

    /* ===============================
       AJOUT PROGRAMME
    =============================== */

    bindForm() {

        const form =
            document.getElementById("addProgrammeForm");

        if (!form) return;

        form.addEventListener("submit", async (e) => {

            e.preventDefault();

            const user = AuthService.currentUser();

            // 🔒 sécurité
            if (!user || user.role !== "super-admin") {
                alert("Accès refusé ❌");
                return;
            }

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            if (!data.titre || !data.date) {
                alert("Titre et date obligatoires");
                return;
            }

            const { error } =
                await supabaseClient
                    .from("pastoral_programme")
                    .insert([{
                        titre: data.titre,
                        description: data.description || "",
                        date: data.date
                    }]);

            if (error) {
                console.error(error);
                alert("Erreur ajout ❌");
                return;
            }

            alert("Programme ajouté 📅");

            form.reset();
            await this.render();
        });
    },

    /* ===============================
       AFFICHAGE PROGRAMMES
    =============================== */

    async render() {

        const tbody =
            document.querySelector("#programmeTable tbody");

        if (!tbody) return;

        const { data, error } =
            await supabaseClient
                .from("pastoral_programme")
                .select("*")
                .order("date", { ascending: true });

        if (error) {
            console.error(error);
            alert("Erreur chargement ❌");
            return;
        }

        tbody.innerHTML = "";

        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5">Aucun programme disponible</td>
                </tr>
            `;
            return;
        }

        const user = AuthService.currentUser();

        data.forEach(p => {

            const tr = document.createElement("tr");

            tr.innerHTML = `
                
                <td>${p.titre}</td>
                <td>${p.description || ""}</td>
                <td>${p.date}</td>
                <td>
                    ${
                        user?.role === "super-admin"
                        ? `<button onclick="ProgrammeModule.delete(${p.id})">
                            ❌
                           </button>`
                        : ""
                    }
                </td>
            `;

            tbody.appendChild(tr);
        });
    },

    /* ===============================
       SUPPRESSION
    =============================== */

    async delete(id) {

        const user = AuthService.currentUser();

        if (!user || user.role !== "super-admin") {
            alert("Accès refusé ❌");
            return;
        }

        if (!confirm("Supprimer ce programme ?")) return;

        const { error } =
            await supabaseClient
                .from("pastoral_programme")
                .delete()
                .eq("id", id);

        if (error) {
            console.error(error);
            alert("Erreur suppression ❌");
            return;
        }

        alert("Programme supprimé ✅");

        await this.render();
    }

};

// 🔥 IMPORTANT pour onclick HTML
window.ProgrammeModule = ProgrammeModule;