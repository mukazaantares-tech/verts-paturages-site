const YouthPublic = {

    init() {
        this.loadContent();
    },

    loadContent() {

        const data =
            DataService.get("vp_jeunesse_settings") || {};

        const title =
            document.getElementById("youthTitle");

        if (title)
            title.textContent =
                data.title || "JAEL";

        const slogan =
            document.getElementById("youthSlogan");

        if (slogan)
            slogan.textContent =
                data.slogan || "";
    }

};