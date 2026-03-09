// ===============================
// DATASERVICE - COUCHE ABSTRACTION
// ===============================

const DataService = {

    // MÉTHODES GÉNÉRIQUES
    get(key) {
        return JSON.parse(localStorage.getItem(key));
    },

    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    // ===============================
    // JEUNESSE
    // ===============================

    getYouthMembers() {
        return this.get("vp_youth_members") || [];
    },

    saveYouthMembers(data) {
        this.set("vp_youth_members", data);
    },

    getYouthComments() {
        return this.get("vp_youth_comments") || [];
    },

    saveYouthComments(data) {
        this.set("vp_youth_comments", data);
    },

    // ===============================
    // VERSETS
    // ===============================

    getWeeklyVerses() {
        return this.get("vp_weekly_verses") || [];
    },

    saveWeeklyVerses(data) {
        this.set("vp_weekly_verses", data);
    },

    getVerseLikes() {
        return this.get("vp_verse_likes") || [];
    },

    saveVerseLikes(data) {
        this.set("vp_verse_likes", data);
    },

    // ===============================
    // DÉPARTEMENTS
    // ===============================

    getDepartements() {
        return this.get("vp_departements_media") || [];
    },

    saveDepartements(data) {
        this.set("vp_departements_media", data);
    }

};