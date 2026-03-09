const YouthActivitiesPublic = {

    init() {
        this.render();
    },

    render() {

        const container =
            document.getElementById("youthActivities");

        if (!container) return;

        const data =
            DataService.get("vp_jeunesse_activities") || [];

        container.innerHTML = "";

        data.forEach(act => {

            const div =
                document.createElement("div");

            div.className =
                "bg-white p-6 rounded shadow";

            div.innerHTML = `
                <h3>${act.titre}</h3>
                <p>${act.description}</p>
            `;

            container.appendChild(div);
        });
    }

};