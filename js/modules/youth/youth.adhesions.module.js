const YouthAdhesions = {

    async init() {
        await this.render();
        this.enableRealtime();
    },

    /* ===============================
       AFFICHER DEMANDES
    =============================== */

    async render() {

        const container =
            document.getElementById("adhesionList");

        if (!container) return;

        const { data: requests, error } =
            await supabaseClient
                .from("youth_requests")
                .select("*")
                .eq("statut", "en_attente")
                .order("created_at", { ascending: false });

        if (error) {
            console.error("Erreur chargement demandes :", error);
            return;
        }

        container.innerHTML = "";

        if (!requests || requests.length === 0) {

            container.innerHTML =
                "<p class='text-gray-500'>Aucune demande en attente</p>";

            return;
        }

        requests.forEach(req => {

            const div =
                document.createElement("div");

            div.className =
                "bg-white p-4 rounded shadow mb-3 flex justify-between items-center";

            div.innerHTML = `
                <div>
                    <strong>${req.nom}</strong>
                    <p class="text-sm text-gray-500">${req.email}</p>
                </div>

                <div class="flex gap-2">

                    <button
                        onclick="YouthAdhesions.approve(${req.id})"
                        class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                        Accepter
                    </button>

                    <button
                        onclick="YouthAdhesions.reject(${req.id})"
                        class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                        Refuser
                    </button>

                </div>
            `;

            container.appendChild(div);

        });

    },

    /* ===============================
       ACCEPTER DEMANDE
    =============================== */

    async approve(id) {

        const { data: req, error } =
            await supabaseClient
                .from("youth_requests")
                .select("*")
                .eq("id", id)
                .single();

        if (error || !req) {
            console.error("Erreur récupération demande :", error);
            return;
        }

        /* ===============================
           AJOUT MEMBRE
        =============================== */

        const { error: insertError } =
            await supabaseClient
                .from("youth_members")
                .insert([
                    {
                        nom: req.nom,
                        email: req.email,
                        sexe: req.sexe,
                        telephone: req.telephone,
                        statut: "actif"
                    }
                ]);

        if (insertError) {
            console.error("Erreur insertion membre :", insertError);
            alert("Erreur lors de l'ajout du membre");
            return;
        }

        /* ===============================
           MAJ DEMANDE
        =============================== */

        await supabaseClient
            .from("youth_requests")
            .update({ statut: "accepte" })
            .eq("id", id);

        alert("Membre ajouté avec succès 💜");

        await this.render();

        if (typeof YouthDashboard !== "undefined") {
            YouthDashboard.renderStats();
        }

    },

    /* ===============================
       REFUSER DEMANDE
    =============================== */

    async reject(id) {

        if (!confirm("Refuser cette demande ?")) return;

        const { error } =
            await supabaseClient
                .from("youth_requests")
                .update({ statut: "refuse" })
                .eq("id", id);

        if (error) {
            console.error("Erreur refus demande :", error);
            return;
        }

        alert("Demande refusée");

        await this.render();
    },

    /* ===============================
       SUPABASE REALTIME
    =============================== */

    enableRealtime() {

        supabaseClient
            .channel("youth_requests_changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "youth_requests"
                },
                () => {

                    console.log("Realtime update");

                    this.render();

                }
            )
            .subscribe();

    }

};