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
      .select(
        `
        *,
        youth_comments(count)
    `,
      )
      .eq("status", "published")
      .order("activity_date", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    if (error) {
      console.error(error);

      return;
    }

    container.innerHTML = "";

    if (!data.length) {
      return this.showEmpty(container);
    }

    activities.forEach((activity) => {
      container.appendChild(this.createCard(activity));
    });
  },

  createCard(activity) {
    const commentsCount = activity.youth_comments?.[0]?.count ?? 0;
    const card = document.createElement("article");

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

                ${this.truncate(activity.description)}

            </p>

            <div class="space-y-2 text-sm">

                <p>📂 ${activity.category ?? "-"}</p>

                <p>📅 ${this.formatDate(activity.activity_date)}</p>

                <p>🕒 ${activity.activity_time ?? "-"}</p>

                <p>📍 ${activity.location ?? "-"}</p>

            </div>
            <div class="mt-3 text-sm text-gray-500">

                💬 ${commentsCount} commentaire${commentsCount > 1 ? "s" : ""}

            </div>

            <button

                class="mt-5 w-full bg-purple-700 text-white py-2 rounded"

                onclick="YouthActivitiesPublic.view('${activity.id}')">

                Voir les détails

            </button>

        </div>

    `;

    return card;
  },

  formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",

      month: "long",

      year: "numeric",
    });
  },
  truncate(text, size = 120) {
    if (!text) return "";

    if (text.length <= size) return text;

    return text.substring(0, size) + "...";
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

    this.openModal(data);

    if (typeof YouthCommentsPublic !== "undefined") {
      YouthCommentsPublic.setActivity(id);
    }
  },
  openModal(activity) {
    document.getElementById("modalActivityTitle").textContent = activity.title;

    document.getElementById("modalActivityDescription").textContent =
      activity.description || "";

    document.getElementById("modalCategory").textContent =
      activity.category || "-";

    document.getElementById("modalDate").textContent = this.formatDate(
      activity.activity_date,
    );

    document.getElementById("modalTime").textContent =
      activity.activity_time || "-";

    document.getElementById("modalLocation").textContent =
      activity.location || "-";

    document.getElementById("modalStatus").textContent = activity.status;

    this.loadImage(activity.image_url);

    this.loadVideo(activity.video_url);

    if (typeof YouthCommentsPublic !== "undefined") {
      YouthCommentsPublic.setActivity(activity.id);
    }

    document.getElementById("activityModal").classList.remove("hidden");
  },

  loadImage(url) {
    const img = document.getElementById("modalActivityImage");

    if (!img) return;

    if (url) {
      img.src = url;

      img.classList.remove("hidden");
    } else {
      img.classList.add("hidden");
    }
  },

  loadVideo(url) {
    const videoContainer = document.getElementById("modalActivityVideo");

    if (!videoContainer) return;

    if (!url) {
      videoContainer.innerHTML = "";

      return;
    }

    videoContainer.innerHTML = `

        <video
            controls
            class="w-full rounded-lg mt-4">

            <source
                src="${url}"
                type="video/mp4">

        </video>

    `;
  },
  closeModal() {
    document.getElementById("activityModal").classList.add("hidden");
  },

  bindModal() {
    document.getElementById("closeActivityModal")?.addEventListener(
      "click",

      () => this.closeModal(),
    );
  },
  bindModal() {
    const close = document.getElementById("closeActivityModal");

    if (close) {
      close.addEventListener("click", () => {
        this.closeModal();
      });
    }
    const modal = document.getElementById("activityModal");

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });
  },
};

window.YouthActivitiesPublic = YouthActivitiesPublic;
