document.addEventListener("DOMContentLoaded", () => {

    console.log("App chargé 🚀");

    /* ===============================
       AUTHENTIFICATION
    =============================== */

    if (typeof AuthService !== "undefined") {
        AuthService.init();

        const path = window.location.pathname;

        if (path.includes("Bureau-pastorale")) {
            AuthService.protect(["super-admin"]);
        }

        if (path.includes("jeunesse-admin")) {
            AuthService.protect([
                "super-admin"

            ]);
        }
        if (path.includes("administration_jeunesse")) {
            AuthService.protect([
            "youth-super-admin",
            "youth-admin",
            "super-admin"

            ]);

            }
    }

/* ===============================
   SIDEBAR NAVIGATION
=============================== */

const sidebarItems =
 document.querySelectorAll(".sidebar li");

if (sidebarItems.length > 0) {

 sidebarItems.forEach(item => {

  item.addEventListener("click", () => {

   const section =
    item.dataset.section;

   console.log(
    "Section :",
    section
   );


   const target =
    document.getElementById(section);


   /* si section absente sur page */
   if (!target) return;


   /* menu actif */
   sidebarItems.forEach(li =>
    li.classList.remove("active")
   );

   item.classList.add("active");


   /* cache toutes sections */
   document
   .querySelectorAll(".section")
   .forEach(sec => {

    sec.classList.remove("active");

    sec.classList.add("hidden");

   });


   /* affiche section */
   target.classList.remove("hidden");

   target.classList.add("active");


   /* fix map */
   if (
    section === "parametres" &&
    typeof LocalisationModule !== "undefined"
   ) {

    if (!LocalisationModule.map) {

     LocalisationModule.initMap();

     LocalisationModule.loadLocations();

    }

    setTimeout(() => {

     LocalisationModule
     .map
     ?.invalidateSize();

    }, 200);

   }

  });

 });

}

    /* ===============================
       MODAL ADHESION
    =============================== */

    const btn = document.getElementById("adhesionBtn");
    const modal = document.getElementById("adhesionModal");
    const closeBtn = document.getElementById("closeAdhesionModal");

    if (btn && modal) {

        btn.addEventListener("click", () => {
            modal.classList.remove("hidden");
        });

        closeBtn?.addEventListener("click", () => {
            modal.classList.add("hidden");
        });

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.add("hidden");
            }
        });

    }

    /* ===============================
       MODULES ADMIN
    =============================== */

    if (typeof DashboardModule !== "undefined")
        DashboardModule.init();

    if (typeof MembersModule !== "undefined")
        MembersModule.init();

    if (typeof AdhesionsModule !== "undefined")
        AdhesionsModule.init();

    if (typeof ProgrammeModule !== "undefined")
        ProgrammeModule.init();

    if (typeof InstructionsModule !== "undefined")
        InstructionsModule.init();

    if (typeof CouplesModule !== "undefined")
        CouplesModule.init();

    if (typeof ReportsModule !== "undefined")
        ReportsModule.init();

    if (typeof AdminsModule !== "undefined")
        AdminsModule.init();

    if (typeof SettingsModule !== "undefined")
        SettingsModule.init();

    if (typeof DepartementsModule !== "undefined")
        DepartementsModule.init();

    if (typeof VersesModule !== "undefined")
        VersesModule.init();

    if (typeof LocalisationModule !== "undefined")
        LocalisationModule.init();

    if (typeof ExportModule !== "undefined")
        ExportModule.init();

    /* ===============================
       MODULES JEUNESSE
    =============================== */

    if (typeof YouthDashboard !== "undefined")
        YouthDashboard.init();

    if (typeof YouthActivites !== "undefined")
        YouthActivites.init();

    if (typeof YouthAdmins !== "undefined")
        YouthAdmins.init();

    if (typeof YouthCommentsPublic !== "undefined")
        YouthCommentsPublic.init();

    if (typeof YouthCommentsAdmin !== "undefined")
        YouthCommentsAdmin.init();

    if (typeof YouthPublic !== "undefined")
        YouthPublic.init();

    if (typeof YouthActivitiesPublic !== "undefined")
        YouthActivitiesPublic.init();

    if (typeof DepartementsPublic !== "undefined")
        DepartementsPublic.init();

    /* ===============================
       FORMULAIRES GLOBAL
    =============================== */

    if (typeof FormManager !== "undefined")
        FormManager.init();

    if (typeof AccueilModule !== "undefined")
        AccueilModule.init();

    if (typeof VersesPublic !== "undefined")
        VersesPublic.init();

    if (typeof TopbarModule !== "undefined")
        console.log("TopbarModule chargé") ||
        TopbarModule.init();

    if(typeof AccueilResponsive !== "undefined"){
        console.log("AccueilResponsive chargé");
        AccueilResponsive.init();
    }
    if(typeof DashboardResponsive !== "undefined"){
        console.log("DashboardResponsive chargé");
        DashboardResponsive.init();
    }
    if(typeof DepartementsResponsive !== "undefined"){
        console.log("DepartementsResponsive chargé");
        DepartementsResponsive.init();
    }
    if(typeof ServiteursResponsive !== "undefined"){
        console.log("ServiteursResponsive chargé");
        ServiteursResponsive.init();
    }

    if(typeof ConseilResponsive !== "undefined"){
        console.log("ConseilResponsive chargé");
        ConseilResponsive.init();
    }
    if(typeof GlobalResponsive !== "undefined"){
        console.log("GlobalResponsive chargé");
        GlobalResponsive.init();
    }


    if(typeof EventsModule !== "undefined"){
        console.log("eventsModule chargé")
        EventsModule.init();
    }
    if(typeof EventsPublic !== "undefined"){
        console.log("Eventspublic chargé")
        EventsPublic.init();
    }
    if(typeof YouthTopbar !== "undefined"){
        console.log("YouthTopbar chargé")
        YouthTopbar.init();
   }
   
   if(typeof ThemeModule !== "undefined"){
    console.log("ThemeModule chargé")
    ThemeModule.init();
   }
});