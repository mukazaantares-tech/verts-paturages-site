const LocalisationModule = {

    map: null,
    markers: [],
    selectedLatLng: null,

    async init() {
        console.log("LocalisationModule chargé");

        this.initMap();
        this.bindAdd();
        await this.loadLocations();

        // 🔥 corrige affichage si section cachée
        setTimeout(() => {
            this.map?.invalidateSize();
        }, 300);
    },

    /* ===============================
       INITIALISATION MAP
    =============================== */

    initMap() {

        // 🔥 empêcher double initialisation
        if (this.map) return;

        const container = document.getElementById("mapAdmin");
        if (!container) return;

        this.map = L.map("mapAdmin").setView([-11.6647, 27.4794], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap"
        }).addTo(this.map);

        // 📍 sélection position
        this.map.on("click", (e) => {
            this.selectedLatLng = e.latlng;
            alert("Position sélectionnée 📍");
        });
    },

    /* ===============================
       AJOUT LOCALISATION
    =============================== */

    bindAdd() {

        document.getElementById("saveLocation")
            ?.addEventListener("click", async () => {

                const name =
                    document.getElementById("locName").value.trim();

                const type =
                    document.getElementById("locType").value;

                if (!name || !this.selectedLatLng) {
                    alert("Clique sur la carte + mets un nom");
                    return;
                }

                const { error } =
                    await supabaseClient
                        .from("locations")
                        .insert([{
                            name,
                            type,
                            lat: this.selectedLatLng.lat,
                            lng: this.selectedLatLng.lng
                        }]);

                if (error) {
                    console.error(error);
                    alert("Erreur ajout ❌");
                    return;
                }

                alert("Localisation ajoutée ✅");

                // reset champ
                document.getElementById("locName").value = "";

                await this.loadLocations();
            });
    },

    /* ===============================
       CHARGER + AFFICHER
    =============================== */

    async loadLocations() {

        const { data, error } =
            await supabaseClient
                .from("locations")
                .select("*");

        if (error) {
            console.error(error);
            return;
        }

        // 🔥 supprimer anciens markers
        this.markers.forEach(m => this.map.removeLayer(m));
        this.markers = [];

        data.forEach(loc => {

            const icon = L.icon({
                iconUrl:
                    loc.type === "mere"
                        ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                iconSize: [32, 32]
            });

            const marker = L.marker([loc.lat, loc.lng], { icon })
                .addTo(this.map)
                .bindPopup(`
                    <b>${loc.name}</b><br>
                    ${loc.type === "mere" ? "Église mère" : "Extension"}<br>
                    <button onclick="LocalisationModule.delete(${loc.id})">
                        ❌ Supprimer
                    </button>
                `);

            this.markers.push(marker);
        });

        // 🔥 auto zoom comme page publique
        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.3));
        }
    },

    /* ===============================
       SUPPRESSION
    =============================== */

    async delete(id) {

        const user = AuthService.currentUser();

        if (!user || user.role !== "super-admin") {
            alert("Seul le haut-administrateur peut supprimer ❌");
            return;
        }

        if (!confirm("Supprimer cette localisation ?")) return;

        const { error } =
            await supabaseClient
                .from("locations")
                .delete()
                .eq("id", id);

        if (error) {
            console.error(error);
            alert("Erreur suppression ❌");
            return;
        }

        alert("Localisation supprimée ✅");

        await this.loadLocations();
    }

};

// 🔥 IMPORTANT (pour onclick HTML)
window.LocalisationModule = LocalisationModule;