document.addEventListener("DOMContentLoaded", () => {

    if (typeof DepartementsModule !== "undefined") {
        DepartementsModule.init();
    }

});
document.addEventListener("DOMContentLoaded", () => {

    AuthService.init();

    // Protection Bureau
    if (window.location.pathname.includes("Bureau-pastorale")) {
        AuthService.protect(["super-admin"]);
    }

    // Jeunesse admin
    if (path.includes("jeunesse-admin")) {
        AuthService.protect([
            "youth-super-admin",
            "youth-admin",
            "super-admin"
        ]);
    }

    if (typeof DashboardModule !== "undefined")
        DashboardModule.init();

    if (typeof DepartementsModule !== "undefined")
        DepartementsModule.init();

    if (typeof VersesModule !== "undefined")
        VersesModule.init();
    if (typeof LocalisationModule !== "undefined")
        LocalisationModule.init();

    if (typeof ExportModule !== "undefined")
        ExportModule.init();
     // Modules Jeunesse
    if (typeof YouthDashboard !== "undefined")
        YouthDashboard.init();

    if (typeof YouthActivities !== "undefined")
        YouthActivities.init();

    if (typeof YouthAdhesions !== "undefined")
        YouthAdhesions.init();

    if (typeof YouthAdmins !== "undefined")
        YouthAdmins.init();
    if (typeof YouthCommentsPublic !== "undefined")
    YouthCommentsPublic.init();

        if (typeof YouthCommentsAdmin !== "undefined")
            YouthCommentsAdmin.init();

        if (typeof DepartementsPublic !== "undefined")
            DepartementsPublic.init();

        if (typeof YouthPublic !== "undefined")
            YouthPublic.init();

        if (typeof YouthActivitiesPublic !== "undefined")
            YouthActivitiesPublic.init();


});    