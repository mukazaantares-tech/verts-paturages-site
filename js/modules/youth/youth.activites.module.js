const YouthActivities = {
  async init() {
    console.log("YouthActivities.init()");
    await this.render();
    this.resetForm();
    this.bindAdd();
    this.bindViewModal();
    this.bindSearch();
    this.bindFilter();

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

    document.getElementById("modalActivityTitle").textContent =
      data.title || "";

    document.getElementById("modalActivityDescription").textContent =
      data.description || "";

    document.getElementById("modalCategory").textContent = data.category || "-";

    document.getElementById("modalDate").textContent =
      data.activity_date || "-";

    document.getElementById("modalTime").textContent =
      data.activity_time || "-";

    document.getElementById("modalLocation").textContent = data.location || "-";

    document.getElementById("modalStatus").textContent = data.status || "-";

    /* =====================
       IMAGE
    ===================== */

    const img = document.getElementById("modalActivityImage");

    if (data.image_url) {
      img.src = data.image_url;
      img.classList.remove("hidden");
    } else {
      img.src = "Verts-Paturages.png";
      img.classList.remove("hidden");
    }

    /* =====================
       VIDEO
    ===================== */

    const video = document.getElementById("modalActivityVideo");

    video.innerHTML = "";

    if (data.video_url) {
      video.innerHTML = `
            <video
                controls
                class="w-full rounded-lg">

                <source
                    src="${data.video_url}"
                    type="video/mp4">

            </video>
        `;
    }

    /* =====================
       OUVERTURE MODAL
    ===================== */

    document.getElementById("activityModal").classList.remove("hidden");
  },

  async edit(id) {
    const { data, error } = await supabaseClient
      .from("youth_activities")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    editingActivityId = id;

    document.getElementById("activityTitle").value = data.title || "";

    document.getElementById("activityCategory").value = data.category || "";

    document.getElementById("activityDate").value = data.activity_date || "";

    document.getElementById("activityTime").value = data.activity_time || "";

    document.getElementById("activityLocation").value = data.location || "";

    document.getElementById("activityDesc").value = data.description || "";

    document.getElementById("activityStatus").value = data.status || "draft";

    document.getElementById("addActivity").textContent =
      "Mettre à jour l'activité";

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  },

  async delete(id) {
    if (!confirm("Supprimer cette activité ?")) {
      return;
    }

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

  async render() {
    const container = document.getElementById("activityList");

    if (!container) return;

    let query = supabaseClient
      .from("youth_activities")
      .select("*")
      .order("created_at", { ascending: false });

    const search = document.getElementById("activitySearch")?.value.trim();

    const filter = document.getElementById("activityFilter")?.value;

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    if (filter) {
      query = query.eq("status", filter);
    }

    const { data: activities, error } = await query;

    if (error) {
      console.error(error);
      return;
    }

    container.innerHTML = "";

    if (!activities || activities.length === 0) {
      container.innerHTML = `
            <div class="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                Aucune activité enregistrée.
            </div>
        `;

      return;
    }

    activities.forEach((a) => {
      const card = document.createElement("div");

      card.className =
        "activity-card bg-white rounded-xl shadow-lg overflow-hidden mb-8";

      card.innerHTML = `

        <!-- IMAGE -->
        ${
          a.image_url
            ? `
                <img
                    src="${a.image_url}"
                    alt="${a.title}"
                    class="w-full h-64 object-cover">
              `
            : `
                <div class="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                    Aucune image
                </div>
              `
        }

        <div class="p-6">

            <!-- TITRE -->
            <div class="flex justify-between items-center mb-4">

                <h3 class="text-2xl font-bold text-purple-700">
                    ${a.title}
                </h3>

                <span class="
                    px-3 py-1 rounded-full text-sm font-semibold
                    ${
                      a.status === "published"
                        ? "bg-green-100 text-green-700"
                        : a.status === "draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }
                ">
                    ${a.status}
                </span>

            </div>

            <!-- DESCRIPTION -->
            <p class="text-gray-600 mb-6">
                ${a.description ?? ""}
            </p>

            <!-- INFOS -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">

                <div>
                    <strong>📂 Catégorie</strong><br>
                    ${a.category || "-"}
                </div>

                <div>
                    <strong>📅 Date</strong><br>
                    ${a.activity_date || "-"}
                </div>

                <div>
                    <strong>🕒 Heure</strong><br>
                    ${a.activity_time || "-"}
                </div>

                <div>
                    <strong>📍 Lieu</strong><br>
                    ${a.location || "-"}
                </div>

            </div>

            <!-- VIDEO -->
            ${
              a.video_url
                ? `
                <div class="mb-6">

                    <video
                        controls
                        class="w-full rounded-lg">

                        <source src="${a.video_url}">

                    </video>

                </div>
                `
                : ""
            }

            <!-- ACTIONS -->
            <div class="flex flex-wrap gap-3">

                <button
                    class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                    onclick="YouthActivities.view('${a.id}')">

                    👁 Voir

                </button>

                <button
                    class="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
                    onclick="YouthActivities.edit('${a.id}')">

                    ✏ Modifier

                </button>

                <button
                    class="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                    onclick="YouthActivities.delete('${a.id}')">

                    🗑 Supprimer

                </button>

            </div>

        </div>
        `;

      container.appendChild(card);
    });
  },

  bindAdd() {
    console.log("bindAdd() lancé");

    const btn = document.getElementById("addActivity");

    console.log(btn);

    if (!btn) return;

    btn.addEventListener("click", async () => {
      console.log("bouton enregistré chargé");
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

      /* ===========================
   ENREGISTREMENT ACTIVITÉ
=========================== */

      const saveButton = document.getElementById("addActivity");

      try {
        saveButton.disabled = true;
        saveButton.textContent = "Enregistrement...";

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

        if (error) throw error;

        alert("Activité enregistrée avec succès.");

        await this.render();

        this.resetForm();

        document.getElementById("activityModal")?.classList.add("hidden");
      } catch (err) {
        console.error(err);

        alert("Erreur : " + err.message);
      } finally {
        saveButton.disabled = false;
        saveButton.textContent = "Enregistrer l'activité";
      }
    });
  },

  /* ===========================
   recherche
=========================== */

  bindSearch() {
    const input = document.getElementById("activitySearch");

    input?.addEventListener("keyup", () => {
      this.render();
    });
  },

  /* ===========================
   filtre
=========================== */

  bindFilter() {
    const filter = document.getElementById("activityFilter");

    filter?.addEventListener("change", () => {
      this.render();
    });
  },

  bindViewModal() {
    const modal = document.getElementById("viewActivityModal");

    const close = document.getElementById("closeViewActivity");

    close?.addEventListener("click", () => {
      modal.classList.add("hidden");
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
    if (!confirm("Supprimer cette activité ?")) return;

    const { data } = await supabaseClient
      .from("youth_activities")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      if (data.image_url) {
        const imageName = data.image_url.split("/").pop();

        await supabaseClient.storage.from("youth-images").remove([imageName]);
      }

      if (data.video_url) {
        const videoName = data.video_url.split("/").pop();

        await supabaseClient.storage.from("youth-videos").remove([videoName]);
      }
    }

    await supabaseClient.from("youth_activities").delete().eq("id", id);

    await this.render();
  },
};

window.YouthActivities = YouthActivities;
