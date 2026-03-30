const VersesModule = {

    chart: null,

    async init() {
        console.log("VersesModule chargé");

        this.bindAdd();
        await this.render();
        await this.renderTop();
        await this.renderChart();
    },

    /* ===============================
       AJOUT AVEC LIMITE 7
    =============================== */

    bindAdd() {

        document.getElementById("addVerseBtn")
            ?.addEventListener("click", async () => {

                const reference =
                    document.getElementById("verseReferenceInput").value.trim();

                const texte =
                    document.getElementById("verseTextInput").value.trim();

                if (!reference || !texte) {
                    alert("Tous les champs sont obligatoires ❗");
                    return;
                }

                // 🔥 vérifier nombre de versets
                const { data: existing, error: countError } =
                    await supabaseClient
                        .from("verses")
                        .select("*")
                        .order("created_at", { ascending: false });

                if (countError) {
                    console.error(countError);
                    alert("Erreur vérification ❌");
                    return;
                }

                if (existing.length >= 7) {
                    alert("Maximum 7 versets atteints ❗");
                    return;
                }

                // 🔥 insertion
                const { error } =
                    await supabaseClient
                        .from("verses")
                        .insert([{
                            reference,
                            texte,
                            likes: 0
                        }]);

                if (error) {
                    console.error(error);
                    alert("Erreur ajout ❌");
                    return;
                }

                alert("Verset ajouté ✝️");

                document.getElementById("verseReferenceInput").value = "";
                document.getElementById("verseTextInput").value = "";

                await this.render();
                await this.renderTop();
                await this.renderChart();
            });
    },

    /* ===============================
       LISTE DES VERSETS (LIMIT 7)
    =============================== */

    async render() {

        const container =
            document.getElementById("verseList");

        if (!container) return;

        const { data, error } =
            await supabaseClient
                .from("verses")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(7);

        if (error) {
            console.error(error);
            return;
        }

        container.innerHTML = "";

        if (!data.length) {
            container.innerHTML = "Aucun verset disponible";
            return;
        }

        data.forEach(v => {

            const div = document.createElement("div");

            div.className = "adhesion-card";

            div.innerHTML = `
                <strong>${v.reference}</strong>
                <p>${v.texte}</p>

                <div style="margin-top:10px;">
                    ❤️ ${v.likes}

                    <button onclick="VersesModule.like(${v.id})"
                        style="margin-left:10px;">
                        👍
                    </button>

                    <button onclick="VersesModule.delete(${v.id})"
                        style="margin-left:10px;background:red;color:white;">
                        ❌
                    </button>
                </div>
            `;

            container.appendChild(div);
        });
    },

    /* ===============================
       LIKE
    =============================== */

    async like(id) {

        const { data, error } =
            await supabaseClient
                .from("verses")
                .select("*")
                .eq("id", id)
                .single();

        if (error || !data) {
            console.error(error);
            return;
        }

        const { error: updateError } =
            await supabaseClient
                .from("verses")
                .update({
                    likes: data.likes + 1
                })
                .eq("id", id);

        if (updateError) {
            console.error(updateError);
            return;
        }

        await this.render();
        await this.renderTop();
        await this.renderChart();
    },

    /* ===============================
       SUPPRESSION
    =============================== */

    async delete(id) {

        if (!confirm("Supprimer ce verset ?")) return;

        const { error } =
            await supabaseClient
                .from("verses")
                .delete()
                .eq("id", id);

        if (error) {
            console.error(error);
            alert("Erreur suppression ❌");
            return;
        }

        alert("Verset supprimé ✅");

        await this.render();
        await this.renderTop();
        await this.renderChart();
    },

    /* ===============================
       TOP VERSETS
    =============================== */

    async renderTop() {

        const container =
            document.getElementById("topVerses");

        if (!container) return;

        const { data, error } =
            await supabaseClient
                .from("verses")
                .select("*")
                .order("likes", { ascending: false })
                .limit(7);

        if (error) {
            console.error(error);
            return;
        }

        container.innerHTML = "";

        data.forEach(v => {

            const div = document.createElement("div");

            div.innerHTML = `
                <strong>${v.reference}</strong> ❤️ ${v.likes}
            `;

            container.appendChild(div);
        });
    },

    /* ===============================
       GRAPHIQUE
    =============================== */

    async renderChart() {

        const ctx =
            document.getElementById("verseLikesChart");

        if (!ctx) return;

        // 🔥 détruire ancien graphique
        if (this.chart) {
            this.chart.destroy();
        }

        const { data, error } =
            await supabaseClient
                .from("verses")
                .select("*")
                .order("likes", { ascending: false })
                .limit(7);

        if (error) {
            console.error(error);
            return;
        }

        this.chart = new Chart(ctx, {

            type: "bar",

            data: {
                labels: data.map(v => v.reference),
                datasets: [{
                    label: "Likes",
                    data: data.map(v => v.likes)
                }]
            }

        });
    }

};

// 🔥 obligatoire pour les boutons HTML
window.VersesModule = VersesModule;