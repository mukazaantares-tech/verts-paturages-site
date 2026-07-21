const YouthActivities = {
  async init() {
    await this.render();
    this.resetForm();
    this.bindAdd();

    const closeBtn = document.getElementById("closeActivityModal");

    closeBtn?.addEventListener("click", () => {
      document.getElementById("activityModal").classList.add("hidden");
    });
  },

  async view(id) {
    const { data, error } = await supabaseClient
      .from("youth_activities")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);

      return;
    }

    document.getElementById("modalActivityTitle").textContent = data.title;

    document.getElementById("modalActivityDescription").textContent =
      data.description || "";

    document.getElementById("modalCategory").textContent = data.category || "-";

    document.getElementById("modalDate").textContent =
      data.activity_date || "-";

    document.getElementById("modalTime").textContent =
      data.activity_time || "-";

    document.getElementById("modalLocation").textContent = data.location || "-";

    document.getElementById("modalStatus").textContent = data.status;

    const img = document.getElementById("modalActivityImage");

    if (data.image_url) {
      img.src = data.image_url;

      img.style.display = "block";
    } else {
      img.style.display = "none";
    }

    const video = document.getElementById("modalActivityVideo");

    if (data.video_url) {
      video.innerHTML = `

            <video
                controls
                class="w-full rounded-lg">

                <source
                    src="${data.video_url}">

            </video>

        `;
    } else {
      video.innerHTML = "";
    }

    document.getElementById("activityModal").classList.remove("hidden");
  },

  async edit(id) {
    console.log("Modifier :", id);
  },

  async render() {
    const container = document.getElementById("activityList");

    if (!container) return;

    const { data: activities, error } = await supabaseClient
      .from("youth_activities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    container.innerHTML = "";

    activities.forEach((a) => {
      const card = document.createElement("div");

      card.className =
        "activity-card bg-white rounded-lg shadow-md overflow-hidden mb-6";

      card.innerHTML = `

        ${
          a.image_url
            ? `<img
                src="${a.image_url}"
                class="w-full h-56 object-cover">`
            : `<div class="w-full h-56 bg-gray-200 flex items-center justify-center">

                <span>Aucune image</span>

            </div>`
        }

        <div class="p-5">

            <h3 class="text-xl font-bold mb-3">

                ${a.title}

            </h3>

            <p class="text-gray-600 mb-4">

                ${a.description ?? ""}

            </p>

            <div class="grid grid-cols-2 gap-3 text-sm">

                <p><strong>📂 Catégorie :</strong> ${a.category ?? "-"}</p>

                <p><strong>📅 Date :</strong> ${a.activity_date ?? "-"}</p>

                <p><strong>🕒 Heure :</strong> ${a.activity_time ?? "-"}</p>

                <p><strong>📍 Lieu :</strong> ${a.location ?? "-"}</p>

            </div>

            <div class="mt-4">

                <span class="px-3 py-1 rounded bg-green-100 text-green-700">

                    ${a.status}

                </span>

            </div>

            <div class="flex gap-3 mt-6">

                <button
                    class="bg-blue-600 text-white px-4 py-2 rounded"
                    onclick="YouthActivities.view('${a.id}')">

                    Voir

                </button>

                <button
                    class="bg-yellow-500 text-white px-4 py-2 rounded"
                    onclick="YouthActivities.edit('${a.id}')">

                    Modifier

                </button>

                <button
                    class="bg-red-600 text-white px-4 py-2 rounded"
                    onclick="YouthActivities.delete('${a.id}')">

                    Supprimer

                </button>

            </div>

        </div>

    `;

      container.appendChild(card);
    });
  },

  bindAdd() {
    const btn = document.getElementById("addActivity");

    if (!btn) return;

    btn.addEventListener("click", async () => {
      const title = document.getElementById("activityTitle").value.trim();

      const category = document.getElementById("activityCategory").value;

      const activityDate = document.getElementById("activityDate").value;

      const activityTime = document.getElementById("activityTime").value;

      const location = document.getElementById("activityLocation").value.trim();

      const description = document.getElementById("activityDesc").value.trim();

      const status = document.getElementById("activityStatus").value;

      const imageFile = document.getElementById("activityImage").files[0];

      const videoFile = document.getElementById("activityVideo").files[0];

      if (!title) {
        alert("Le titre est obligatoire");

        return;
      }

      const user = await AuthService.currentUser();

      if (!user) {
        alert("Utilisateur non connecté");

        return;
      }

      /* UPLOAD */

      let image_url = null;

      if (imageFile) {
        const imageName = Date.now() + "_" + imageFile.name;

        const { error } = await supabaseClient.storage
          .from("youth-images")
          .upload(imageName, imageFile);

        if (error) {
          console.error(error);

          alert("Erreur upload image");

          return;
        }

        image_url = supabaseClient.storage
          .from("youth-images")
          .getPublicUrl(imageName).data.publicUrl;
      }

      let video_url = null;

      if (videoFile) {
        if (videoFile.size > 50 * 1024 * 1024) {
          alert("Vidéo trop lourde (max 50MB)");

          return;
        }

        const videoName = Date.now() + "_" + videoFile.name;

        const { error } = await supabaseClient.storage
          .from("youth-videos")
          .upload(videoName, videoFile);

        if (error) {
          console.error(error);

          alert("Erreur upload vidéo");

          return;
        }

        video_url = supabaseClient.storage
          .from("youth-videos")
          .getPublicUrl(videoName).data.publicUrl;
      }

      /* INSERT DATABASE */
      const { error } = await supabaseClient.from("youth_activities").insert([
        {
          title,

          description,

          category,

          activity_date: activityDate,

          activity_time: activityTime,

          location,

          image_url,

          video_url,

          status,

          created_by: user.id,
        },
      ]);

      if (error) {
        console.error(error);

        alert(error.message);

        return;
      }

      alert("Activité enregistrée avec succès");
      await this.render();
      this.resetForm();
    });
  },

  resetForm() {
    const fields = [
      "activityTitle",
      "activityCategory",
      "activityDate",
      "activityTime",
      "activityLocation",
      "activityDesc",
      "activityImage",
      "activityVideo",
    ];

    fields.forEach((id) => {
      const input = document.getElementById(id);
      if (input) input.value = "";
    });

    const status = document.getElementById("activityStatus");

    if (status) {
      status.value = "draft";
    }
  },

  /* ===============================
   SUPPRESSION
================================ */

  async delete(id) {
    const confirmation = confirm(
      "Voulez-vous vraiment supprimer cette activité ?",
    );

    if (!confirmation) return;

    const { error } = await supabaseClient
      .from("youth_activities")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);

      alert("Erreur lors de la suppression.");

      return;
    }

    alert("Activité supprimée.");

    await this.render();
  },
};

window.YouthActivities = YouthActivities;
