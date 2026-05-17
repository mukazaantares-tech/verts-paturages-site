// ===============================
// DATASERVICE - GESTION DONNEES
// ===============================

const DataService = {

    /* ===============================
       LIRE DONNEES
    =============================== */

    get(key) {

        try {

            const data = localStorage.getItem(key);

            if (!data) return null;

            return JSON.parse(data);

        } catch (error) {

            console.error("Erreur DataService.get :", error);

            return null;

        }

    },

    /* ===============================
       ENREGISTRER DONNEES
    =============================== */

    set(key, value) {

        try {

            const json = JSON.stringify(value);

            localStorage.setItem(key, json);

        } catch (error) {

            console.error("Erreur DataService.set :", error);

        }

    },

    /* ===============================
       SUPPRIMER
    =============================== */

    remove(key) {

        try {

            localStorage.removeItem(key);

        } catch (error) {

            console.error("Erreur DataService.remove :", error);

        }

    },

    /* ===============================
       AJOUTER DANS UN TABLEAU
    =============================== */

    push(key, value) {

        try {

            const list = this.get(key) || [];

            list.push(value);

            this.set(key, list);

        } catch (error) {

            console.error("Erreur DataService.push :", error);

        }

    },

    /* ===============================
       METTRE A JOUR
    =============================== */

    update(key, id, newData) {

        try {

            const list = this.get(key) || [];

            const index = list.findIndex(i => i.id === id);

            if (index === -1) return;

            list[index] = {
                ...list[index],
                ...newData
            };

            this.set(key, list);

        } catch (error) {

            console.error("Erreur DataService.update :", error);

        }

    },

    /* ===============================
       SUPPRIMER PAR ID
    =============================== */

    delete(key, id) {

        try {

            const list = this.get(key) || [];

            const filtered = list.filter(i => i.id !== id);

            this.set(key, filtered);

        } catch (error) {

            console.error("Erreur DataService.delete :", error);

        }

    },

    /* ===============================
       RESET SYSTEME
    =============================== */

    reset() {

        try {

            localStorage.clear();

            console.warn("Système réinitialisé");

        } catch (error) {

            console.error("Erreur DataService.reset :", error);

        }

    }

};