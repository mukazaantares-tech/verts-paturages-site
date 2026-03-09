const YouthCommentsPublic = {
    
    init() {
        this.bindSubmit();
        this.render();
        this.checkAccess();
    },
     checkAccess() {

    const user = AuthService.currentUser();

    const formZone =
        document.getElementById("commentFormZone");

    const blockedMsg =
        document.getElementById("commentBlocked");

    if (!formZone || !blockedMsg) return;

    // Non connecté
    if (!user) {
        formZone.classList.add("hidden");
        blockedMsg.classList.remove("hidden");
        return;
    }

    // Vérifier si membre validé
    const members =
        DataService.get("vp_youth_members") || [];

    const isMember =
        members.some(m =>
            m.email === user.email &&
            m.statut === "actif"
        );

    if (!isMember) {
        formZone.classList.add("hidden");
        blockedMsg.classList.remove("hidden");
        return;
    }

    // Membre valide
    formZone.classList.remove("hidden");
    blockedMsg.classList.add("hidden");
},
    
    bindSubmit() {

        const btn = document.getElementById("submitComment");
        if (!btn) return;

        btn.addEventListener("click", () => {

            const auteur =
                document.getElementById("commentAuthor").value.trim();

            const message =
                document.getElementById("commentaire").value.trim();

            if (!auteur || !message) {
                alert("Tous les champs sont obligatoires.");
                return;
            }

            const comments =
                DataService.get("vp_youth_comments") || [];

            comments.push({
                id: Date.now(),
                auteur,
                message,
                date: new Date().toISOString(),
                statut: "en_attente",
                likes: 0
            });

            DataService.set("vp_youth_comments", comments);

            alert("Commentaire envoyé pour validation 💜");

            document.getElementById("commentAuthor").value = "";
            document.getElementById("commentaire").value = "";
        });
    },

    render() {

        const container =
            document.getElementById("publicComments");

        if (!container) return;

        const comments =
            DataService.get("vp_youth_comments") || [];

        container.innerHTML = "";

        comments
            .filter(c => c.statut === "approuve")
            .forEach(c => {

                const div =
                    document.createElement("div");

                div.className =
                    "bg-gray-100 p-4 rounded mb-3";

                div.innerHTML = `
                    <strong>${c.auteur}</strong>
                    <p>${c.message}</p>
                    <button onclick="YouthCommentsPublic.like(${c.id})"
                        class="text-sm text-purple-700">
                        ❤️ ${c.likes}
                    </button>
                `;

                container.appendChild(div);
            });
    },

    like(id) {

        const key = "liked_comment_" + id;

        if (localStorage.getItem(key)) {
            alert("Déjà liké 💜");
            return;
        }

        const comments =
            DataService.get("vp_youth_comments") || [];

        const comment =
            comments.find(c => c.id === id);

        if (!comment) return;

        comment.likes++;

        DataService.set("vp_youth_comments", comments);

        localStorage.setItem(key, "true");

        this.render();
    }
   
};

