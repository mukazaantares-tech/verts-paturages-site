const LocalisationModule = {

    map: null,

    init() {
        this.initMap();
        this.initSave();
    },

    initMap() {

        const el =
            document.getElementById("mapAdmin");

        if (!el) return;

        this.map =
            L.map('mapAdmin')
             .setView([-11.6647, 27.4794], 13);

        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ).addTo(this.map);
    },

    initSave() {

        const btn =
            document.getElementById("saveLocation");

        if (!btn) return;

        btn.addEventListener("click", () => {

            const name =
                document.getElementById("locName").value;

            const type =
                document.getElementById("locType").value;

            const data =
                DataService.get("vp_locations") || [];

            data.push({
                id: Date.now(),
                nom: name,
                type
            });

            DataService.set("vp_locations", data);

            alert("Localisation enregistrée");
        });
    }

};