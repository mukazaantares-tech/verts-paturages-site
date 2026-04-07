let chartInstance = null;
let isInitialized = false;

const DashboardModule = {

    async init() {
        if (isInitialized) return;
        isInitialized = true;
        console.log("Dashboard chargé");
        this.initTopbar();
        await this.renderStats();
        await this.renderChart();
    },

    /* ===============================
   TOPBAR
=============================== */

initTopbar() {
    
    const user =
        AuthService.currentUser();
    if (!user) return;
    const roleEl =
        document.getElementById("adminRole");
    const nameEl =
        document.getElementById("adminName");
    if (roleEl)
        roleEl.textContent =
            this.formatRole(user.role);
    if (nameEl)
        nameEl.textContent =
            user.email;
    const logoutBtn =
        document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = async () => {
            await AuthService.logout();
        };
    }
},
formatRole(role) {
    if (!role) return "";
    return role
        .replace("-", " ")
        .toUpperCase();
},
    /* ===============================
       STATISTIQUES
    =============================== */
    async renderStats() {
        try {
            const [
                { data: membres },
                { data: adhesions },
                { data: departements },
                { data: instructions },
                { data: admins }
            ] = await Promise.all([
                supabaseClient
                    .from("church_members")
                    .select("*"),
                supabaseClient
                    .from("adhesion_requests")
                    .select("*"),
                supabaseClient
                    .from("departements")
                    .select("*"),
                supabaseClient
                    .from("instructions")
                    .select("*"),
                supabaseClient
                    .from("admins")
                    .select("*")
            ]);
            document.getElementById("statMembres").textContent =
                membres?.length || 0;
            document.getElementById("statAdhesions").textContent =
                adhesions?.length || 0;
            document.getElementById("statDepartements").textContent =
                departements?.length || 0;
            document.getElementById("statInstructions").textContent =
                instructions?.length || 0;
            document.getElementById("statAdmins").textContent =
                admins?.length || 0;
        }
        catch (err) {
            console.error(
                "Erreur Dashboard :",
                err
            );
        }
    },

    /* ===============================
       GRAPHIQUE GLOBAL
    =============================== */

    async renderChart() {
        try {
            let canvas =
                document.getElementById(
                    "globalStatsChart"
                );
            if (!canvas) return;
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null;
            }
            const parent =
                canvas.parentNode;
            canvas.remove();
            const newCanvas =
                document.createElement("canvas");
            newCanvas.id =
                "globalStatsChart";
            parent.appendChild(newCanvas);
            const ctx =
                newCanvas.getContext("2d");
            const [
                { data: membres },
                { data: adhesions },
                { data: departements },
                { data: instructions },
                { data: admins }
            ] = await Promise.all([
                supabaseClient
                    .from("church_members")
                    .select("*"),
                supabaseClient
                    .from("adhesion_requests")
                    .select("*"),
                supabaseClient
                    .from("departements")
                    .select("*"),
                supabaseClient
                    .from("instructions")
                    .select("*"),
                supabaseClient
                    .from("admins")
                    .select("*")
            ]);
            const membresCount =
                membres?.length || 0;
            const adhesionsCount =
                adhesions?.length || 0;
            const departementsCount =
                departements?.length || 0;
            const instructionsCount =
                instructions?.length || 0;
            const adminsCount =
                admins?.length || 0;
            chartInstance =
                new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: [
                            "Membres",
                            "Adhésions",
                            "Départements",
                            "Instructions",
                            "Admins"
                        ],
                        datasets: [
                            {
                                label:
                                    "Statistiques",
                                data: [
                                    membresCount,
                                    adhesionsCount,
                                    departementsCount,
                                    instructionsCount,
                                    adminsCount
                                ]
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false

                    }
                });
        }
        catch (err) {
            console.error(
                "Erreur graphique :",
                err
            );
        }
    }
};

window.DashboardModule = DashboardModule;

/* =================================
PROTECTION PAGE ADMIN
attend que la session soit restaurée
================================= */

document.addEventListener(
 "DOMContentLoaded",
 async () => {

  try{

   await AuthService.init();

   const user =
    AuthService.currentUser();

   console.log(
    "Utilisateur connecté :",
    user
   );

   if(!user){

    console.warn(
     "aucun utilisateur"
    );

    window.location.href =
     "index.html";

    return;

   }

   /* autoriser admin + super_admin */

   if(
    ![
     "admin",
     "super_admin"
    ].includes(user.role)
   ){

    console.warn(
     "role refusé :",
     user.role
    );

    window.location.href =
     "index.html";

    return;

   }

   /* lancer dashboard */

   DashboardModule.init();

  }

  catch(err){

   console.error(
    "Erreur auth :",
    err
   );

   window.location.href =
    "index.html";

  }

 }
);