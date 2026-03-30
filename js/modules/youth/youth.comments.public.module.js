const YouthCommentsPublic = {

    async init() {

        this.bindSubmit();
        await this.render();

        this.enableRealtime();

    },

    bindSubmit() {

        const btn =
            document.getElementById("submitComment");

        if (!btn) return;

        btn.addEventListener("click", async () => {

            const author =
                document.getElementById("commentAuthor").value.trim();

            const message =
                document.getElementById("newComment").value.trim();

            if (!author || !message) {
                alert("Tous les champs sont obligatoires");
                return;
            }

            const { error } =
                await supabaseClient
                    .from("youth_comments")
                    .insert([
                        {
                            author,
                            message,
                            video: "programme_special",
                            approved: false
                        }
                    ]);

            if (error) {
                console.error(error);
                alert("Erreur envoi commentaire");
                return;
            }

            alert("Commentaire envoyé pour validation");

            document.getElementById("commentAuthor").value = "";
            document.getElementById("newComment").value = "";

        });

    },

    enableRealtime() {

        supabaseClient
        .channel("comments_channel")

        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "youth_comments"
            },

            () => {

                console.log("Realtime commentaire");
                this.render();

            }
        )

        .subscribe();

    },

    async render() {

        const container =
            document.getElementById("publicComments");

        if (!container) return;

        const { data: comments } =
            await supabaseClient
                .from("youth_comments")
                .select("*")
                .eq("approved", true)
                .order("created_at", { ascending: false });

        container.innerHTML = "";

        comments.forEach(c => {

            const div = document.createElement("div");

            div.className =
                "bg-gray-100 p-4 rounded mb-3";

            div.innerHTML = `
                <strong>${c.author}</strong>
                <p>${c.message}</p>

                <button
                    onclick="YouthCommentsPublic.like(${c.id})"
                    class="text-purple-700 text-sm">
                    ❤️ ${c.likes}
                </button>
            `;

            container.appendChild(div);

        });

    },

    async like(id) {

        const { data } =
            await supabaseClient
                .from("youth_comments")
                .select("likes")
                .eq("id", id)
                .single();

        const likes = data.likes + 1;

        await supabaseClient
            .from("youth_comments")
            .update({ likes })
            .eq("id", id);

        this.render();

    }

};

