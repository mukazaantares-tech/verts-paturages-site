const YouthActivities = {

    async init() {
        await this.render();
        this.bindAdd();
    },

    async render() {

        const container =
            document.getElementById("activityList");

        if (!container) return;

        const { data: activities, error } =
            await supabaseClient
                .from("youth_activities")
                .select("*")
                .order("created_at", { ascending:false });

        if (error) {
            console.error(error);
            return;
        }

        container.innerHTML = "";

        activities.forEach(a => {

            const div = document.createElement("div");

            div.className =
                "bg-white p-4 rounded shadow mb-3";

            div.innerHTML = `
                <strong>${a.titre}</strong>
                <p>${a.description}</p>

                <button
                    onclick="YouthActivities.delete(${a.id})"
                    class="bg-red-600 text-white px-2 py-1 rounded">
                    Supprimer
                </button>
            `;

            container.appendChild(div);

        });

    },

    bindAdd() {

const btn =
document.getElementById("addActivity")

if(!btn) return

btn.addEventListener("click", async () => {

const titre =
document.getElementById("activityTitle").value.trim()

const description =
document.getElementById("activityDesc").value.trim()

const fileInput =
document.getElementById("activityVideo")

const file = fileInput.files[0]

/* CONTROLE TAILLE VIDEO */

        if(file && file.size > 50 * 1024 * 1024){
        alert("Vidéo trop lourde (max 50MB)")
        return
        }

        if(!titre){
        alert("Titre requis")
        return
        }

        let video_url = null

        /* UPLOAD */

        if(file){

        const fileName =
        Date.now() + "_" + file.name

        const { error:uploadError } =
        await supabaseClient
        .storage
        .from("youth-media")
        .upload(fileName,file)

        if(uploadError){
        console.error(uploadError)
        alert("Erreur upload vidéo")
        return
        }

        const { data:urlData } =
        supabaseClient
        .storage
        .from("youth-media")
        .getPublicUrl(fileName)

        video_url = urlData.publicUrl

        }

        /* INSERT DATABASE */

    await supabaseClient
        .from("youth_activities")
        .insert([{
        titre,
        description,
        video_url
        }])

        alert("Activité ajoutée")

        this.render()

})

},

    async delete(id) {

        if (!confirm("Supprimer activité ?")) return;

        await supabaseClient
            .from("youth_activities")
            .delete()
            .eq("id", id);

        this.render();

    }

};