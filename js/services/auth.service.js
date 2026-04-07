// ===============================
// AUTHSERVICE - SUPABASE VERSION STABLE
// Compatible avec ton architecture actuelle
// ===============================

const AuthService = {

    /* ===============================
       INITIALISATION
    =============================== */

    async init() {

        try {

            const { data: { session } } =
                await supabaseClient.auth.getSession();

            if (!session?.user) return;

            const role =
                await this.fetchRole(
                    session.user.email
                );

            const user = {

                email: session.user.email,
                role: role || "admin"

            };

            DataService.set(
                "vp_current_user",
                user
            );

            console.log(
                "Session restaurée :",
                user.email,
                user.role
            );

        } catch (err) {

            console.error(
                "Erreur init auth :",
                err
            );

        }

    },


    /* ===============================
       LOGIN
    =============================== */

    async login(email, password) {

        try {

            const { data, error } =
                await supabaseClient
                .auth
                .signInWithPassword({

                    email,
                    password

                });

            if (error) {

                console.error(
                    "Erreur login :",
                    error.message
                );

                return false;

            }


            const role =
                await this.fetchRole(
                    data.user.email
                );

            const user = {

                email: data.user.email,
                role: role || "admin"

            };

            DataService.set(
                "vp_current_user",
                user
            );

            console.log(
                "Connecté :",
                user.email,
                user.role
            );

            return true;

        } catch (err) {

            console.error(
                "Erreur login :",
                err
            );

            return false;

        }

    },


    /* ===============================
       LOGOUT
    =============================== */

    async logout() {

        await supabaseClient
        .auth
        .signOut();

        DataService.remove(
            "vp_current_user"
        );

        window.location.href =
            "index.html";

    },


    /* ===============================
       UTILISATEUR ACTUEL
    =============================== */

    currentUser() {

        return DataService.get(
            "vp_current_user"
        );

    },


    /* ===============================
       RECUPERATION ROLE
    =============================== */

    async fetchRole(email) {

        try {

            const cleanEmail =
                email
                .toLowerCase()
                .trim();

            const { data, error } =
                await supabaseClient
                    .from("admins")
                    .select("role")
                    .eq("email", cleanEmail)
                    .maybeSingle();


            if (error) {

                console.warn(
                    "Erreur role :",
                    error.message
                );

                return null;

            }


            if (!data) {

                console.warn(
                    "Role non trouvé pour :",
                    cleanEmail
                );

                return null;

            }


            return data.role;

        }

        catch (err) {

            console.error(
                "Erreur fetchRole :",
                err
            );

            return null;

        }

    },


    /* ===============================
       PROTECTION PAGE
    =============================== */

    protect(roles = []) {

        const user =
            this.currentUser();

        if (!user) {

            console.warn(
                "Utilisateur non connecté"
            );

            window.location.href =
                "index.html";

            return;

        }


        if (

            roles.length &&

            !roles.includes(user.role)

        ) {

            console.warn(
                "Accès refusé pour role :",
                user.role
            );

            window.location.href =
                "index.html";

        }

    }

};


window.AuthService =
 AuthService;