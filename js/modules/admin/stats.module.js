const StatsModule = {

    init() {
        this.render();
    },

    render() {

        const members =
            DataService.get("vp_members") || [];

        const couples =
            DataService.get("vp_couples") || [];

        const requests =
            DataService.get("vp_adhesions") || [];

        const membersEl =
            document.getElementById("statMembers");

        if (membersEl)
            membersEl.textContent =
                members.length;

        // ajoute ici autres stats si besoin
    }

};