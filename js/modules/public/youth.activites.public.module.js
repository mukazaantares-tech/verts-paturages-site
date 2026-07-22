const YouthActivitiesPublic = {
  async init() {
    await this.render();

    this.bindModal();
  },

  async render() {
    const container = document.getElementById("youthMainActivities");

    if (!container) return;

    const { data: activities, error } = await supabaseClient
      .from("youth_activities")
      .select("*")
      .eq("status", "published")
      .order("activity_date", { ascending: true });

    if (error) {
      console.error(error);

      return;
    }

    container.innerHTML = "";

    if (!activities || activities.length === 0) {
      container.innerHTML = `
                <div class="col-span-full text-center py-10">
                    <h3 class="text-xl font-semibold text-gray-500">
                        Aucune activité disponible.
                    </h3>
                </div>
            `;

      return;
    }

    activities.forEach((activity) => {
      const card = document.createElement("div");

      card.className =
        "bg-white rounded-xl shadow-lg overflow-hidden transition hover:shadow-2xl";

      card.innerHTML = `

                ${
                  activity.image_url
                    ? `
                    <img
                        src="${activity.image_url}"
                        class="w-full h-56 object-cover">
                    `
                    : `
                    <div class="w-full h-56 bg-gray-200 flex items-center justify-center">
                        <span>Aucune image</span>
                    </div>
                    `
                }

                <div class="p-5">

                    <h3 class="text-xl font-bold mb-2">
                        ${activity.title}
                    </h3>

                    <p class="text-gray-600 mb-4">
                        ${(activity.description ?? "").substring(0, 120)}...
                    </p>

                    <div class="space-y-2 text-sm">

                        <p>📂 ${activity.category ?? "-"}</p>

                        <p>📅 ${activity.activity_date ?? "-"}</p>

                        <p>🕒 ${activity.activity_time ?? "-"}</p>

                        <p>📍 ${activity.location ?? "-"}</p>

                    </div>

                    <button
                        class="mt-5 w-full bg-purple-700 text-white py-2 rounded"
                        onclick="YouthActivitiesPublic.view('${activity.id}')">

                        Voir les détails

                    </button>

                </div>

            `;

      container.appendChild(card);
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
      data.description ?? "";

    document.getElementById("modalCategory").textContent = data.category ?? "-";

    document.getElementById("modalDate").textContent =
      data.activity_date ?? "-";

    document.getElementById("modalTime").textContent =
      data.activity_time ?? "-";

    document.getElementById("modalLocation").textContent = data.location ?? "-";

    document.getElementById("modalStatus").textContent = data.status;

    const image = document.getElementById("modalActivityImage");

    if (data.image_url) {
      image.src = data.image_url;

      image.classList.remove("hidden");
    } else {
      image.classList.add("hidden");
    }

    const video = document.getElementById("modalActivityVideo");

    if (data.video_url) {
      video.innerHTML = `
                <video controls class="w-full rounded-lg mt-4">
                    <source src="${data.video_url}">
                </video>
            `;
    } else {
      video.innerHTML = "";
    }

    document.getElementById("activityModal").classList.remove("hidden");

    YouthCommentsPublic.setActivity(id);
  },

  bindModal() {
    const close = document.getElementById("closeActivityModal");

    if (!close) return;

    close.addEventListener("click", () => {
      document.getElementById("activityModal").classList.add("hidden");
    });
  },
};

window.YouthActivitiesPublic = YouthActivitiesPublic;
