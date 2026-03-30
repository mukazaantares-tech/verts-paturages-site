/* =================================
   RESPONSIVE NAVBAR
================================= */

const AccueilResponsive = {

    init() {

        this.initBurger();

        this.autoCloseMenu();

        this.initModals();

    },


    /* =============================
       MENU MOBILE
    ============================= */

    initBurger() {

    const burger =
        document.getElementById("burger");

    const nav =
        document.getElementById("navLinks");

    if (!burger || !nav) {

        console.warn("burger ou navLinks introuvable");
        return;

    }

    burger.addEventListener("click", (e) => {

        e.stopPropagation();

        nav.classList.toggle("open");

    });


    document.addEventListener("click", (e) => {

        if (

            !nav.contains(e.target) &&
            !burger.contains(e.target)

        ) {

            nav.classList.remove("open");

        }

    });

},


    /* =============================
       FERMER MENU APRES CLIC
    ============================= */

    autoCloseMenu() {

        document
        .querySelectorAll(".nav-links a")
        .forEach(link => {

            link.addEventListener("click", () => {

                document
                .getElementById("navLinks")
                ?.classList.remove("open");

            });

        });

    },


    /* =============================
       MODAL INSCRIPTION
    ============================= */

    initModals() {

        const joinBtn =
            document.getElementById("joinBtn");

        const joinModal =
            document.getElementById("joinModal");

        const closeModal =
            document.getElementById("closeModal");


        joinBtn?.addEventListener("click", () => {

            joinModal.classList.remove("hidden");

        });


        closeModal?.addEventListener("click", () => {

            joinModal.classList.add("hidden");

        });


        joinModal?.addEventListener("click", e => {

            if (e.target === joinModal)

                joinModal.classList.add("hidden");

        });



        /* =============================
           MODAL ADMIN LOGIN
        ============================= */

        const adminBtn =
            document.getElementById("adminBtn");

        const adminModal =
            document.getElementById("adminModal");

        const closeAdmin =
            document.getElementById("closeAdminModal");


        adminBtn?.addEventListener("click", () => {

            adminModal.classList.remove("hidden");

        });


        closeAdmin?.addEventListener("click", () => {

            adminModal.classList.add("hidden");

        });


        adminModal?.addEventListener("click", e => {

            if (e.target === adminModal)

                adminModal.classList.add("hidden");

        });

    }

};


window.AccueilResponsive = AccueilResponsive;