const YouthCommentsAdmin = {

    init() {
        this.render();
    },

    render() {

        const container =
            document.getElementById("adminCommentList");

        if (!container) return;

        const comments =
            DataService.get("vp_youth_comments") || [];

        container.innerHTML = "";

        comments
            .filter(c => c.statut === "en_attente")
            .forEach(c => {

                const div =
                    document.createElement("div");

                div.className =
                    "bg-white p-4 rounded shadow mb-3";

                div.innerHTML = `
                    <strong>${c.auteur}</strong>
                    <p>${c.message}</p>

                    <button onclick="YouthCommentsAdmin.approve(${c.id})"
                        class="bg-green-600 text-white px-3 py-1 rounded mr-2">
                        Valider
                    </button>

                    <button onclick="YouthCommentsAdmin.delete(${c.id})"
                        class="bg-red-600 text-white px-3 py-1 rounded">
                        Supprimer
                    </button>
                `;

                container.appendChild(div);
            });
    },

    approve(id) {

        const comments =
            DataService.get("vp_youth_comments") || [];

        const comment =
            comments.find(c => c.id === id);

        if (!comment) return;

        comment.statut = "approuve";

        DataService.set("vp_youth_comments", comments);

        this.render();
    },

    delete(id) {

        let comments =
            DataService.get("vp_youth_comments") || [];

        comments =
            comments.filter(c => c.id !== id);

        DataService.set("vp_youth_comments", comments);

        this.render();
    }

};