// ===============================
// MODULE DEPARTEMENTS
// ===============================

const DepartementsModule = {

    init() {
        this.initSaveButton();
    },

    initSaveButton() {

        const btn = document.getElementById("saveDeptBtn");
        if (!btn) return;

        btn.addEventListener("click", () => {

            const name =
                document.getElementById("deptName").value.trim();

            const presidentName =
                document.getElementById("presidentName").value.trim();

            const presidentDesc =
                document.getElementById("presidentDesc").value.trim();

            const fileInput =
                document.getElementById("presidentPhotoFile");

            if (!name) {
                alert("Nom requis");
                return;
            }

            const file = fileInput?.files[0];

            if (file) {

                const reader = new FileReader();

                reader.onload = (e) => {

                    const photoBase64 = e.target.result;

                    this.saveDepartment(
                        name,
                        presidentName,
                        presidentDesc,
                        photoBase64
                    );
                };

                reader.readAsDataURL(file);

            } else {

                this.saveDepartment(
                    name,
                    presidentName,
                    presidentDesc,
                    null
                );
            }

        });
    },

    saveDepartment(name, presidentName, presidentDesc, photo) {

        const data = DataService.getDepartements();

        const existing =
            data.find(d => d.departement === name);

        const presidentData = {
            nom: presidentName,
            description: presidentDesc,
            photo: photo
        };

        if (existing) {
            existing.president = presidentData;
        } else {
            data.push({
                departement: name,
                president: presidentData,
                images: [],
                videos: []
            });
        }

        DataService.saveDepartements(data);

        alert("Département enregistré");
    }

};
document.getElementById("saveDeptBtn")
?.addEventListener("click", () => {

    const name = document.getElementById("deptName").value.trim();
    const presidentName = document.getElementById("presidentName").value.trim();
    const presidentDesc = document.getElementById("presidentDesc").value.trim();
    const fileInput = document.getElementById("presidentPhotoFile");

    if (!name) {
        alert("Nom requis");
        return;
    }

    const file = fileInput.files[0];

    if (file) {

        const reader = new FileReader();

        reader.onload = function(e) {

            const photoBase64 = e.target.result;

            saveDepartment(name, presidentName, presidentDesc, photoBase64);
        };

        reader.readAsDataURL(file);

    } else {

        saveDepartment(name, presidentName, presidentDesc, null);
    }

});
function saveDepartment(name, presidentName, presidentDesc, photo) {

    const data = DataService.getDepartements();

    const existing = data.find(d => d.departement === name);

    const presidentData = {
        nom: presidentName,
        description: presidentDesc,
        photo: photo
    };

    if (existing) {
        existing.president = presidentData;
    } else {
        data.push({
            departement: name,
            president: presidentData,
            images: [],
            videos: []
        });
    }

    DataService.saveDepartements(data);

    alert("Département enregistré");
}
