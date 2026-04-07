// ===============================
// AUTHSERVICE SIMPLE ET STABLE
// ===============================

const AuthService = {

    /* ===============================
       LOGIN
    =============================== */

    /* ===============================
   INITIALISATION SIMPLE
=============================== */

init(){

 const user =
  this.currentUser();

 if(user){

  console.log(
   "session trouvée :",
   user.email,
   user.role
  );

 }

},

    async login(email, password) {

        try {

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({

                    email,
                    password

                });

            if (error) {

                console.error("Erreur login :", error.message);

                return false;

            }


            /* récupérer role */

            const { data: adminData } =
                await supabaseClient
                    .from("admins")
                    .select("role")
                    .eq("email", data.user.email)
                    .single();


            if (!adminData) {

                console.warn("email non autorisé");

                return false;

            }


            const user = {

                email: data.user.email,
                role: adminData.role

            };


            localStorage.setItem(

                "vp_current_user",

                JSON.stringify(user)

            );


            console.log("connecté :", user);


            return true;

        }

        catch (err) {

            console.error(err);

            return false;

        }

    },


    /* ===============================
       UTILISATEUR ACTUEL
    =============================== */

    currentUser() {

        const data =
            localStorage.getItem("vp_current_user");

        return data
            ? JSON.parse(data)
            : null;

    },


    /* ===============================
       LOGOUT
    =============================== */

    async logout() {

        await supabaseClient.auth.signOut();

        localStorage.removeItem("vp_current_user");

        window.location.href = "index.html";

    },


    /* ===============================
       PROTECTION PAGE ADMIN
    =============================== */

    protect(roles = []) {

        const user = this.currentUser();


        if (!user) {

            window.location.href = "bureau-pastorale.html";

            return;

        }


        if (!roles.includes(user.role)) {

            window.location.href = "bureau-pastorale.html";

        }

    }

};

window.AuthService = AuthService;