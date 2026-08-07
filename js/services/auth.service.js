// ===============================
// AUTHSERVICE SIMPLE ET STABLE
// ===============================

const AuthService = {
  /* ===============================
       LOGIN
    =============================== */

  /* ===============================
   INITIALISATION SIMPLE
=============================== */

  async init() {
    const user = await this.currentUser();

    if (user) {
      console.log("session trouvée :", user.email, user.role);
    }
  },

  async login(email, password) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erreur login :", error.message);

        return false;
      }

      /* récupérer role */

      const { data: adminData } = await supabaseClient
        .from("admins")
        .select("role")
        .eq("email", data.user.email)
        .single();
      console.log("Utilisateur connecté :", data.user.email);
      console.log("Rôle trouvé :", adminData);

      if (!adminData) {
        console.warn("email non autorisé");

        console.log("Objet retourné :", {
          email: data.user.email,
          role: adminData.role,
        });

        return false;
      }

      const user = {
        email: data.user.email,
        role: adminData.role,
      };

      console.log("connecté :", user);
      console.log("ROLE EXACT =", JSON.stringify(user.role));

      return {
        email: data.user.email,
        role: adminData.role,
      };
    } catch (err) {
      console.error(err);

      return false;
    }
  },

  /* ===============================
       UTILISATEUR ACTUEL
    =============================== */

  async currentUser() {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) return null;

    const { data: admin } = await supabaseClient
      .from("admins")
      .select("*")
      .eq("email", user.email)
      .single();

    if (!admin) return null;

    return {
      id: user.id,

      email: user.email,

      role: admin.role,

      nom: admin.nom,
    };
  },

  /* ===============================
       LOGOUT
    =============================== */

  async logout() {
    try {
      const confirmation = confirm("Voulez-vous vraiment vous déconnecter ?");

      if (!confirmation) return;

      // Déconnexion Supabase
      await supabaseClient.auth.signOut();

      // Nettoyage des données locales
      localStorage.removeItem("vp_current_user");
      sessionStorage.clear();

      console.log("Déconnexion réussie.");

      // Retour à l'accueil
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);

      alert("Impossible de se déconnecter.");
    }
  },
  /* ===============================
   PROTECTION PAGE ADMIN (FINAL)
=============================== */

  async protect(roles = []) {
    const user = await this.currentUser();

    if (!user) {
      console.warn("Accès refusé : non connecté");

      window.location.href = "index.html";

      return;
    }

    if (roles.length && !roles.includes(user.role)) {
      console.warn("Accès refusé pour role :", user.role);

      window.location.href = "index.html";

      return;
    }

    console.log("Accès autorisé :", user.email, user.role);
  },
};

window.AuthService = AuthService;
