const YouthCommentsPublic = {
  currentActivityId: null,
  async init() {
    this.bindSubmit();
    this.resetForm();
    this.enableRealtime();
  },
  setActivity(activityId) {
    this.currentActivityId = activityId;

    this.render(activityId);
  },

  bindSubmit() {
    const btn = document.getElementById("submitComment");

    if (!btn) return;

    btn.addEventListener("click", async () => {
      const author = document.getElementById("commentAuthor").value.trim();

      const message = document.getElementById("newComment").value.trim();

      if (!author || !message) {
        alert("Tous les champs sont obligatoires");
        return;
      }

      const { error } = await supabaseClient.from("youth_comments").insert([
        {
          activity_id: this.currentActivityId,

          author,

          message,

          status: "pending",
        },
      ]);

      if (error) {
        console.error(error);
        alert("Erreur envoi commentaire");
        return;
      }

      alert("Commentaire envoyé pour validation");

      document.getElementById("commentAuthor").value = "";
      document.getElementById("newComment").value = "";
    });
  },
  resetForm() {
    const el = (id) => document.getElementById(id);

    if (el("commentAuthor")) el("commentAuthor").value = "";

    if (el("newComment")) el("newComment").value = "";
  },

  enableRealtime() {
    supabaseClient
      .channel("comments_channel")

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "youth_comments",
        },

        () => {
          console.log("Realtime commentaire");
          this.render(this.currentActivityId);
        },
      )

      .subscribe();
  },

  async render(activityId = this.currentActivityId) {
    if (!activityId) return;
    const container = document.getElementById("publicComments");

    if (!container) return;

    const { data: comments, error } = await supabaseClient
      .from("youth_comments")
      .select("*")
      .eq("activity_id", activityId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);

      return;
    }
    if (!this.currentActivityId) {
      alert("Aucune activité sélectionnée.");

      return;
    }

    container.innerHTML = "";

    comments.forEach((c) => {
      const div = document.createElement("div");

      div.className = "bg-gray-100 p-4 rounded mb-3";

      div.innerHTML = `
                <strong>${c.author}</strong>
                <p>${c.message}</p>

                <button
                    onclick="YouthCommentsPublic.like('${c.id}')"
                    class="text-purple-700 text-sm">
                    ❤️ ${c.likes}
                </button>
            `;

      container.appendChild(div);
    });
  },

  async like(id) {
    const { data, error } = await supabaseClient
      .from("youth_comments")
      .select("likes")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);

      return;
    }

    const likes = (data.likes ?? 0) + 1;

    await supabaseClient.from("youth_comments").update({ likes }).eq("id", id);

    this.render();
  },
};
