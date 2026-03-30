const YouthActivitiesPublic = {

    async init() {
        await this.render();
    },

    async render() {

        const container =
            document.getElementById("youthActivities");

        if (!container) return;

        const { data: activities } =
            await supabaseClient
                .from("youth_activities")
                .select("*")
                .order("created_at", { ascending:false });

        container.innerHTML = "";

        activities.forEach(a => {

            const div = document.createElement("div");

            div.className =
                "event mb-6 border-l-4 border-purple-600 pl-4";

            div.innerHTML = `
                <h3 class="font-semibold">${a.titre}</h3>
                <p>${a.description}</p>

                ${
                    a.video_url
                    ? `
                    <video
                    controls
                    class="w-full mt-3 rounded">

                    <source src="${a.video_url}" type="video/mp4">

                    </video>
                    `
                    : ""
            }
            `;

            container.appendChild(div);

        });

    }

};