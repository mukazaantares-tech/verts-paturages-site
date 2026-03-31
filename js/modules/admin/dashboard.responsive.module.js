/* =================================
   DASHBOARD RESPONSIVE MODULE
================================= */

const DashboardResponsive = {

    init(){

        console.log(
            "Dashboard responsive chargé"
        );

        this.initSidebarToggle();

        this.autoCloseSidebar();

        this.closeOnOutsideClick();

    },


    /* ============================
       TOGGLE SIDEBAR MOBILE
    ============================ */

    initSidebarToggle(){

        const toggleBtn =
            document.getElementById(
                "sidebarToggle"
            );

        const sidebar =
            document.querySelector(
                ".sidebar"
            );

        if(
            !toggleBtn ||
            !sidebar
        ){

            console.warn(
                "sidebar responsive non trouvé"
            );

            return;

        }


        toggleBtn
        .addEventListener("click",()=>{

            sidebar
            .classList
            .toggle("open");

        });

    },


    /* ============================
       AUTO CLOSE MENU
    ============================ */

    autoCloseSidebar(){

        const sidebarLinks =
            document.querySelectorAll(
                ".sidebar li"
            );

        const sidebar =
            document.querySelector(
                ".sidebar"
            );

        sidebarLinks
        .forEach(link=>{

            link
            .addEventListener(
                "click",

                ()=>{

                    sidebar
                    ?.classList
                    .remove("open");

                }

            );

        });

    },


    /* ============================
       CLOSE IF CLICK OUTSIDE
    ============================ */

    closeOnOutsideClick(){

        const sidebar =
            document.querySelector(
                ".sidebar"
            );

        const toggleBtn =
            document.getElementById(
                "sidebarToggle"
            );

        document
        .addEventListener(
            "click",

            (e)=>{

                if(

                    !sidebar
                    ?.contains(e.target)

                    &&

                    !toggleBtn
                    ?.contains(e.target)

                ){

                    sidebar
                    ?.classList
                    .remove("open");

                }

            }

        );

    }

};

window.DashboardResponsive =
    DashboardResponsive;