const YouthCommentsAdmin = {

    async init() {
        await this.render();
    },

    async render() {

        const container =
            document.getElementById("commentsAdminList");

        if (!container) return;

        const { data: comments, error } =
            await supabaseClient
                .from("youth_comments")
                .select("*")
                .eq("approved", false)
                .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        container.innerHTML = "";

        if (!comments.length) {

            container.innerHTML =
                "<p class='text-gray-500'>Aucun commentaire en attente</p>";

            return;
        }

        comments.forEach(c => {

            const div =
                document.createElement("div");

            div.className =
                "bg-white p-4 rounded shadow mb-3";

            div.innerHTML = `
                <strong>${c.author}</strong>
                <p class="mb-2">${c.message}</p>

                <div class="flex gap-2">

                    <button
                        onclick="YouthCommentsAdmin.approve(${c.id})"
                        class="bg-green-600 text-white px-3 py-1 rounded">
                        Valider
                    </button>

                    <button
                        onclick="YouthCommentsAdmin.delete(${c.id})"
                        class="bg-red-600 text-white px-3 py-1 rounded">
                        Supprimer
                    </button>

                </div>
            `;

            container.appendChild(div);

        });

    },

    async approve(id) {

        const { error } =
            await supabaseClient
                .from("youth_comments")
                .update({ approved: true })
                .eq("id", id);

        if (error) {
            console.error(error);
            return;
        }

        alert("Commentaire validé");

        await this.render();
    },

    async delete(id) {

        if (!confirm("Supprimer ce commentaire ?")) return;

        const { error } =
            await supabaseClient
                .from("youth_comments")
                .delete()
                .eq("id", id);

        if (error) {
            console.error(error);
            return;
        }

        alert("Commentaire supprimé");

        await this.render();
    }

};