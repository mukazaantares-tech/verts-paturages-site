const YouthActivities = {

    init() {
        this.render();
        this.bindAdd();
    },

    render() {

        const container =
            document.getElementById("activityList");

        if (!container) return;

        const data =
            DataService.get("vp_jeunesse_activities") || [];

        container.innerHTML = "";

        data.forEach(a => {

            const div =
                document.createElement("div");

            div.className =
                "bg-white p-4 rounded shadow mb-2";

            div.innerHTML = `
                <strong>${a.titre}</strong>
                <p>${a.description}</p>
            `;

            container.appendChild(div);
        });
    },

    bindAdd() {

        const btn =
            document.getElementById("addActivity");

        if (!btn) return;

        btn.addEventListener("click", () => {

            const title =
                document.getElementById("activityTitle").value.trim();

            const desc =
                document.getElementById("activityDesc").value.trim();

            if (!title || !desc) return;

            const data =
                DataService.get("vp_jeunesse_activities") || [];

            data.push({
                id: Date.now(),
                titre: title,
                description: desc
            });

            DataService.set("vp_jeunesse_activities", data);

            this.render();
        });
    }

};