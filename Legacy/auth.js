// ===============================
// AUTH.JS - SYSTEME AUTHENTIFICATION
// ===============================

const Auth = {

    // Initialisation automatique
    init() {

        // Vérifie si la table des admins existe
        let admins = JSON.parse(localStorage.getItem("vp_admins")) || [];

        // Si aucun admin -> créer le super admin principal
        if (admins.length === 0) {

            const superAdmin = {
                id: Date.now(),
                name: "Pasteur Principal",
                email: "pasteur@verts.com",
                password: "1234",
                role: "super-admin"
            };

            admins.push(superAdmin);
            localStorage.setItem("vp_admins", JSON.stringify(admins));

            console.log("✅ Super-Admin créé automatiquement.");
        }
        // Vérifier si youth-super-admin existe
        const youthExists = admins.some(a => a.role === "youth-super-admin");

        if (!youthExists) {

            admins.push({
                id: Date.now() + 1,
                name: "Président Jeunesse",
                email: "jael@verts.com",
                password: "1234",
                role: "youth-super-admin"
            });

            localStorage.setItem("vp_admins", JSON.stringify(admins));
            console.log("✅ Youth Super Admin créé.");
        }
            },

    login(email, password) {

        const admins = JSON.parse(localStorage.getItem("vp_admins")) || [];

        const user = admins.find(
            admin => admin.email === email && admin.password === password
        );

        if (!user) return false;

        localStorage.setItem("vp_current_user", JSON.stringify(user));
        return true;
    },

    logout() {
        localStorage.removeItem("vp_current_user");
        window.location.href = "Accueil.html";
    },

    currentUser() {
        return JSON.parse(localStorage.getItem("vp_current_user"));
    },

    isSuperAdmin() {
        const user = this.currentUser();
        return user && user.role === "super-admin";
    },
    isYouthAdmin() {
    const user = this.currentUser();
    return user && (
        user.role === "youth-super-admin" ||
        user.role === "youth-admin"
    );
},

        isYouthSuperAdmin() {
            const user = this.currentUser();
            return user && user.role === "youth-super-admin";
        },

    protectPage() {
        const user = this.currentUser();
        if (!user) {
            window.location.href = "Accueil.html";
        }
    }
    
};


// ⚠️ IMPORTANT : Initialiser automatiquement
document.addEventListener("DOMContentLoaded", () => {
    Auth.init();
});


