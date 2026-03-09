const YouthAdmins = {

    init() {
        this.render();
        this.bindAdd();
    },

    render() {

        const container =
            document.getElementById("adminList");

        if (!container) return;

        const admins =
            DataService.get("vp_admins") || [];

        const youthAdmins =
            admins.filter(a =>
                a.role.includes("youth")
            );

        container.innerHTML = "";

        youthAdmins.forEach(a => {

            const div =
                document.createElement("div");

            div.className =
                "bg-white p-3 rounded shadow mb-2";

            div.textContent =
                `${a.email} (${a.role})`;

            container.appendChild(div);
        });
    },

    bindAdd() {

        const btn =
            document.getElementById("addYouthAdmin");

        if (!btn) return;

        btn.addEventListener("click", () => {

            const email =
                document.getElementById("newAdminEmail").value.trim();

            const role =
                document.getElementById("newAdminRole").value;

            if (!email) return;

            const admins =
                DataService.get("vp_admins") || [];

            admins.push({
                id: Date.now(),
                email,
                password: "1234",
                role
            });

            DataService.set("vp_admins", admins);

            this.render();
        });
    }

};