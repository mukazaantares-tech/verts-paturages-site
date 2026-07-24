const YouthCommentsAdmin = {
  currentSearch: "",
  currentFilter: "all",
  async init() {
    await this.render();
    this.bindFilters();
    this.bindSearch();
    this.enableRealtime();
  },

  async render() {
    const container = document.getElementById("commentsList");

    if (!container) return;

    const { data: comments, error } = await supabaseClient

      .from("youth_comments")

      .select(
        `
            *,
            youth_activities(title)
        `,
      )

      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);

      return;
    }

    container.innerHTML = "";
    let filteredComments = comments ?? [];
    if (this.currentSearch !== "") {
      filteredComments = filteredComments.filter((comment) => {
        return (
          comment.author?.toLowerCase().includes(this.currentSearch) ||
          comment.message?.toLowerCase().includes(this.currentSearch) ||
          comment.youth_activities?.title
            ?.toLowerCase()
            .includes(this.currentSearch)
        );
      });
    }
    if (this.currentFilter !== "all") {
      filteredComments = comments.filter(
        (comment) => comment.status === this.currentFilter,
      );
    }

    if (!filteredComments.length) {
      return this.showEmpty(container);
    }

    filteredComments.forEach((comment) => {
      container.appendChild(this.createCard(comment));
    });

    this.updateStats(comments);
  },
  bindSearch() {
    const input = document.getElementById("commentSearch");

    if (!input) return;

    input.addEventListener("input", () => {
      this.currentSearch = input.value.toLowerCase().trim();

      this.render();
    });
  },
  createCard(comment) {
    const card = document.createElement("div");

    card.className = "bg-white rounded-xl shadow p-5 mb-5";

    card.innerHTML = `

        <div class="flex justify-between items-start">

            <div>

                <h3 class="font-bold">

                    ${comment.author}

                </h3>

                <p class="text-gray-500 text-sm">

                    ${comment.youth_activities?.title ?? "Activité inconnue"}

                </p>
                <p class="text-xs text-gray-400 mt-1">

                  ${this.formatDate(comment.created_at)}

                  </p>

            </div>

            <span class="${this.getStatusColor(comment.status)}">

                ${comment.status}

            </span>

        </div>

        <p class="mt-4">

            ${comment.message}

        </p>

        <div class="flex gap-3 mt-5">

            ${
              comment.status !== "approved"
                ? `

                <button
                class="bg-green-600 text-white px-4 py-2 rounded"
                onclick="YouthCommentsAdmin.approve('${comment.id}')">

                ✔ Approuver

                </button>

                `
                : ""
            }

                ${
                  comment.status !== "rejected"
                    ? `

                <button
                class="bg-yellow-500 text-white px-4 py-2 rounded"
                onclick="YouthCommentsAdmin.reject('${comment.id}')">

                Refuser

                </button>

                `
                    : ""
                }

            <button

                class="bg-red-600 text-white px-4 py-2 rounded"

                onclick="YouthCommentsAdmin.delete('${comment.id}')">

                Supprimer

            </button>

        </div>

    `;

    return card;
  },
  formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleString("fr-FR", {
      dateStyle: "medium",

      timeStyle: "short",
    });
  },

  getStatusColor(status) {
    switch (status) {
      case "approved":
        return "px-3 py-1 rounded bg-green-100 text-green-700";

      case "rejected":
        return "px-3 py-1 rounded bg-red-100 text-red-700";

      default:
        return "px-3 py-1 rounded bg-yellow-100 text-yellow-700";
    }
  },

  async approve(id) {
    const { error } = await supabaseClient
      .from("youth_comments")
      .update({ approved: true })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }
    if (!confirm("voulez-vous approuver ce commentaire ?")) {
      return;
    }

    alert("Commentaire validé");

    await this.render();
  },

  async delete(id) {
    if (!confirm("Voulez-vous supprimer ce commentaire ?")) return;

    const { error } = await supabaseClient
      .from("youth_comments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    alert("Commentaire supprimé");

    await this.render();
  },
  async approve(id) {
    const { error } = await supabaseClient
      .from("youth_comments")
      .update({
        status: "approved",
      })
      .eq("id", id);

    if (error) {
      console.error(error);

      alert(error.message);

      return;
    }

    await this.render();
  },
  async reject(id) {
    const { error } = await supabaseClient
      .from("youth_comments")
      .update({
        status: "rejected",
      })
      .eq("id", id);

    if (error) {
      console.error(error);

      alert(error.message);

      return;
    }

    await this.render();
  },
  async delete(id) {
    if (!confirm("Voulez-vous supprimer ce commentaire ?")) {
      return;
    }

    const { error } = await supabaseClient
      .from("youth_comments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);

      alert(error.message);

      return;
    }

    await this.render();
  },
  bindFilters() {
    document

      .querySelectorAll(".comment-filter")

      .forEach((button) => {
        button.addEventListener("click", () => {
          this.currentFilter = button.dataset.filter;

          this.render();
        });
      });
  },
  enableRealtime() {
    supabaseClient

      .channel("admin_comments")

      .on(
        "postgres_changes",

        {
          event: "*",

          schema: "public",

          table: "youth_comments",
        },

        () => {
          console.log("Commentaires mis à jour");

          this.render();
        },
      )

      .subscribe();
  },
  updateStats(comments) {
    const pending = comments.filter((c) => c.status === "pending").length;

    const approved = comments.filter((c) => c.status === "approved").length;

    const rejected = comments.filter((c) => c.status === "rejected").length;

    document.getElementById("pendingCount").textContent = pending;

    document.getElementById("approvedCount").textContent = approved;

    document.getElementById("rejectedCount").textContent = rejected;
  },
  showEmpty(container) {
    let title = "Aucun commentaire";

    let message = "Les commentaires apparaîtront ici.";

    if (this.currentSearch !== "") {
      title = "Aucun résultat trouvé";

      message = `Aucun commentaire ne correspond à "${this.currentSearch}".`;
    } else if (this.currentFilter !== "all") {
      title = "Aucun commentaire";

      message = `Aucun commentaire ${this.currentFilter}.`;
    }

    container.innerHTML = `

        <div class="bg-white rounded-xl shadow p-8 text-center">

            <div class="text-5xl mb-4">

                💬

            </div>

            <h3 class="text-xl font-bold">

                ${title}

            </h3>

            <p class="text-gray-500 mt-3">

                ${message}

            </p>

        </div>

    `;
  },
};
