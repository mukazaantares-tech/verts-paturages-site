const VersesPublic = {

    currentVerse: null,

    async init() {
        await this.loadVerse();
        this.bindLike();
    },

    /* ===============================
       CHARGER VERSET DU JOUR
    =============================== */

    async loadVerse() {

        const { data, error } =
            await supabaseClient
                .from("verses")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(1);

        if (error || !data.length) {
            console.error(error);
            return;
        }

        const verse = data[0];
        this.currentVerse = verse;

        document.getElementById("verseText").textContent =
            `"${verse.texte}"`;

        document.getElementById("verseReference").textContent =
            verse.reference;

        document.getElementById("verseLikeCount").textContent =
            verse.likes;
    },

    /* ===============================
       LIKE
    =============================== */

    bindLike() {

        const btn =
            document.getElementById("likeVerseBtn");

        if (!btn) return;

        btn.addEventListener("click", async () => {

            if (!this.currentVerse) return;

            const id = this.currentVerse.id;

            // 🔥 éviter double like local
            const key = "liked_verse_" + id;

            if (localStorage.getItem(key)) {
                alert("Déjà liké 💜");
                return;
            }

            const { error } =
                await supabaseClient
                    .from("verses")
                    .update({
                        likes: this.currentVerse.likes + 1
                    })
                    .eq("id", id);

            if (error) {
                console.error(error);
                return;
            }

            localStorage.setItem(key, "true");

            // 🔥 animation
            btn.classList.add("scale-110");
            setTimeout(() => btn.classList.remove("scale-110"), 200);

            await this.loadVerse();
        });
    }

};

window.VersesPublic = VersesPublic;