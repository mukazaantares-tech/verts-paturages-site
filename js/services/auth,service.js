// ===============================
// AUTHSERVICE - VERSION PLATEFORME
// ===============================

const AuthService = {

    init() {
        this.ensureDefaultAdmins();
    },

    ensureDefaultAdmins() {

        let admins = DataService.get("vp_admins") || [];

        if (admins.length === 0) {

            admins.push({
                id: Date.now(),
                name: "Pasteur Principal",
                email: "pasteur@verts.com",
                password: "1234",
                role: "super-admin"
            });

            DataService.set("vp_admins", admins);
        }
    },

    login(email, password) {

        const admins = DataService.get("vp_admins") || [];

        const user = admins.find(a =>
            a.email === email && a.password === password
        );

        if (!user) return false;

        DataService.set("vp_current_user", user);
        return true;
    },

    logout() {
        DataService.remove("vp_current_user");
        window.location.href = "Accueil.html";
    },

    currentUser() {
        return DataService.get("vp_current_user");
    },

    hasRole(role) {
        const user = this.currentUser();
        return user && user.role === role;
    },

    protect(roles = []) {

        const user = this.currentUser();

        if (!user || (roles.length && !roles.includes(user.role))) {
            window.location.href = "Accueil.html";
        }
    }

};