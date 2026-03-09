const DepartementsPublic = {

    init() {
        this.render();
    },

    render() {

        const container =
            document.getElementById("departementsList");

        if (!container) return;

        const data =
            DataService.get("vp_departements_media") || [];

        container.innerHTML = "";

        data.forEach(dep => {

            const div =
                document.createElement("div");

            div.className =
                "bg-white p-6 rounded shadow";

            div.innerHTML = `
                <h3 class="text-xl font-bold text-green-700">
                    ${dep.departement}
                </h3>
                <p>${dep.president?.nom || ""}</p>
            `;

            container.appendChild(div);
        });
    }

};