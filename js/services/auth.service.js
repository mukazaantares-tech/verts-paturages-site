// ===============================
// AUTHSERVICE - VERSION FINALE STABLE
// Compatible avec ton architecture actuelle
// ===============================

const AuthService = {

    /* ===============================
       INITIALISATION SESSION
    =============================== */

    async init() {

        try {

            /* attendre utilisateur confirmé */

            const { data:{ user } } =
                await supabaseClient.auth.getUser();

            if (!user) {

                console.warn(
                    "aucune session active"
                );

                return;

            }


            /* récupérer role depuis table admins */

            const role =
                await this.fetchRole(
                    user.email
                );


            const currentUser = {

                email:
                    user.email,

                role:
                    role || "admin"

            };


            DataService.set(

                "vp_current_user",

                currentUser

            );


            console.log(

                "Session restaurée :",

                currentUser.email,

                currentUser.role

            );

        }

        catch (err) {

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

            const cleanEmail =
                email.toLowerCase().trim();


            const { data, error } =
                await supabaseClient
                .auth
                .signInWithPassword({

                    email:
                        cleanEmail,

                    password

                });


            if (error) {

                console.error(

                    "Erreur login :",

                    error.message

                );

                return false;

            }


            /* récupérer role */

            const role =
                await this.fetchRole(
                    data.user.email
                );


            const currentUser = {

                email:
                    data.user.email,

                role:
                    role || "admin"

            };


            DataService.set(

                "vp_current_user",

                currentUser

            );


            console.log(

                "Connecté :",

                currentUser.email,

                currentUser.role

            );


            return true;

        }

        catch (err) {

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

                    .eq(
                        "email",
                        cleanEmail
                    )

                    .maybeSingle();



            if (error) {

                console.warn(

                    "Erreur récupération role :",

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
       PROTECTION PAGE ADMIN
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

            !roles.includes(
                user.role
            )

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


/* rendre accessible globalement */

window.AuthService =
 AuthService;