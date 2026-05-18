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
                .order("created_at", { ascending: true })
                .limit(7);

        if (error) {
            console.error(error);
            return;
        }

        if (!data || data.length === 0) {
            console.error("Aucun verset disponible");
            return;
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const firstVerseDate = new Date(data[0].created_at);
        const firstDay = new Date(firstVerseDate.getFullYear(), firstVerseDate.getMonth(), firstVerseDate.getDate());
        const dayOffset = Math.floor((today - firstDay) / 86400000);

        let dailyIndex;
        if (dayOffset >= 0 && dayOffset < data.length) {
            dailyIndex = dayOffset;
        } else {
            dailyIndex = Math.floor(Math.random() * data.length);
        }

        const verse = data[dailyIndex];
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