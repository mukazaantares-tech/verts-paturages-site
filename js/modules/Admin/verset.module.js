const VersesModule = {

    init() {
        this.loadVerses();
        this.initAddButton();
    },

    loadVerses() {

        const container =
            document.getElementById("verseList");

        if (!container) return;

        const verses =
            DataService.getWeeklyVerses();

        container.innerHTML = "";

        verses.forEach(v => {

            const div = document.createElement("div");

            div.innerHTML = `
                <strong>${v.reference}</strong>
                <p>${v.texte}</p>
            `;

            container.appendChild(div);
        });
    },

    initAddButton() {

        const btn =
            document.getElementById("addVerseBtn");

        if (!btn) return;

        btn.addEventListener("click", () => {

            const reference =
                document.getElementById("verseReferenceInput").value.trim();

            const texte =
                document.getElementById("verseTextInput").value.trim();

            if (!reference || !texte) return;

            const verses =
                DataService.getWeeklyVerses();

            if (verses.length >= 7) {
                alert("Maximum 7 versets autorisés.");
                return;
            }

            verses.push({
                id: Date.now(),
                reference,
                texte
            });

            DataService.saveWeeklyVerses(verses);

            this.loadVerses();
        });
    }

};