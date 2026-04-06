/* ======================================================
   ADMINS MODULE
   gestion complete des administrateurs
   VERSION STABLE
====================================================== */

const AdminsModule = {

    async init() {

        console.log("AdminsModule chargé");

        this.bindForm();

        await this.loadAdmins();

    },

    /* ======================================================
       CREATION ADMIN (AUTH + DATABASE)
    ====================================================== */

    async createAdmin({ name, email, password, role }) {

        try {

            if (!email || !password || !role)
                throw new Error("Champs requis manquants");


            /* normalisation données */

            const cleanEmail =
                email.toLowerCase().trim();

            const cleanRole =
                role.toLowerCase().trim();

            const cleanName =
                name?.trim();


            console.log(
                "Création admin :",
                cleanEmail,
                cleanRole
            );


            /* 1️⃣ création utilisateur Supabase Auth */

            const {
                data: authData,
                error: authError
            } = await supabaseClient.auth.signUp({

                email: cleanEmail,

                password: password,

                options: {

                    emailRedirectTo:
                    "https://verts-paturages-site.vercel.app/admin"

                }

            });

            if (authError)
                throw authError;


            /* 2️⃣ insertion dans table admins */

            const {
                error: dbError
            } = await supabaseClient
                .from("admins")
                .insert([{

                    name: cleanName,

                    email: cleanEmail,

                    role: cleanRole

                }]);

            if (dbError)
                throw dbError;


            alert(
                "Administrateur créé avec succès"
            );

            await this.loadAdmins();

            return true;

        }

        catch (err) {

            console.error(
                "Erreur création admin :",
                err.message
            );

            alert(err.message);

            return false;

        }

    },

    /* ======================================================
       LECTURE ADMINS
    ====================================================== */

    async loadAdmins() {

        try {

            const {
                data,
                error
            } = await supabaseClient
                .from("admins")
                .select("*")
                .order("created_at", {
                    ascending: false
                });

            if (error)
                throw error;

            this.renderAdmins(data);

        }

        catch (err) {

            console.error(
                "Erreur chargement admins",
                err
            );

        }

    },

    /* ======================================================
       AFFICHAGE LISTE ADMINS
    ====================================================== */

    renderAdmins(admins = []) {

        const container =
            document.getElementById("adminList");

        if (!container) return;

        container.innerHTML = "";

        admins.forEach(admin => {

            const div =
                document.createElement("div");

            div.className =
                "admin-item";

            div.innerHTML = `

                <div class="admin-card">

                    <strong>
                        ${admin.name || "Sans nom"}
                    </strong>

                    <p>
                        ${admin.email}
                    </p>

                    <span class="role-badge">
                        ${admin.role}
                    </span>

                    <button
                        class="delete-admin"
                        data-id="${admin.id}"
                    >
                        Supprimer
                    </button>

                </div>

            `;

            container.appendChild(div);

        });

        this.bindDelete();

    },

    /* ======================================================
       SUPPRESSION ADMIN
    ====================================================== */

    bindDelete() {

        document
        .querySelectorAll(".delete-admin")

        .forEach(btn => {

            btn.onclick = async () => {

                const id =
                    btn.dataset.id;

                if (!confirm(
                    "Supprimer cet admin ?"
                )) return;


                await supabaseClient
                    .from("admins")
                    .delete()
                    .eq("id", id);


                this.loadAdmins();

            };

        });

    },

    /* ======================================================
       FORMULAIRE
    ====================================================== */

    bindForm() {

        const form =
            document.getElementById(
                "addAdminForm"
            );

        if (!form) return;


        form.addEventListener(
            "submit",

            async e => {

                e.preventDefault();


                const name =
                    document
                    .getElementById("name")
                    .value;


                const email =
                    document
                    .getElementById("email")
                    .value;


                const password =
                    document
                    .getElementById("password")
                    .value;


                const role =
                    document
                    .getElementById("role")
                    .value;


                await this.createAdmin({

                    name,

                    email,

                    password,

                    role

                });


                form.reset();

            }

        );

    }

};

window.AdminsModule = AdminsModule;