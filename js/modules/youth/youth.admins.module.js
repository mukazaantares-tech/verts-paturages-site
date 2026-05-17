const YouthAdmins = {

 init(){

  this.checkPermission();

  this.bindAdd();

  this.loadAdmins();

 },


/* =============================
   VERIFICATION ROLE
============================= */

 checkPermission(){

  const user =
  AuthService.currentUser();

  if(!user) return;


  if(

   user.role !== "youth-super-admin"
   &&
   user.role !== "super-admin"

  ){

   document
   .getElementById("addYouthAdmin")
   ?.remove();

   document
   .getElementById("newAdminEmail")
   ?.setAttribute("disabled", true);

   document
   .getElementById("newAdminRole")
   ?.setAttribute("disabled", true);

   console.warn(
    "Permission refusée"
   );

  }

 },


/* =============================
   BIND BUTTON
============================= */

 bindAdd(){

  document
  .getElementById("addYouthAdmin")
  ?.addEventListener("click", () => {

   this.createAdmin();

  });

 },


/* =============================
   CREATION ADMIN
============================= */

 async createAdmin(){

  const email =
  document
  .getElementById("newAdminEmail")
  ?.value
  ?.trim();

  const role =
  document
  .getElementById("newAdminRole")
  ?.value;


  if(!email){

   alert(
    "Email requis"
   );

   return;

  }


  const user =
  AuthService.currentUser();


  if(

   user.role !== "youth-super-admin"
   &&
   user.role !== "super-admin"

  ){

   alert(
    "Action non autorisée"
   );

   return;

  }


/* password temporaire automatique */

  const tempPassword =

  Math.random()
  .toString(36)
  .slice(-10);


/* création compte auth */

  const { error: authError } =

  await supabaseClient
  .auth
  .signUp({

   email,
   password: tempPassword

  });


  if(authError){

   alert(
    authError.message
   );

   return;

  }


/* insertion role */

  const { error: dbError } =

  await supabaseClient
  .from("admins")
  .insert({

   email,
   role

  });


  if(dbError){

   alert(
    dbError.message
   );

   return;

  }


  alert(

   "Administrateur créé.\nUn email lui permettra de définir son mot de passe."

  );


/* reset champ */

  document
  .getElementById("newAdminEmail")
  .value = "";


/* reload liste */

  this.loadAdmins();

 },


/* =============================
   LISTE ADMINS
============================= */

 async loadAdmins(){

  const container =
  document
  .getElementById("adminList");

  if(!container) return;


  const { data, error } =

  await supabaseClient
  .from("admins")
  .select("*")
  .like("role","youth%")
  .order("email");


  if(error){

   console.error(
    error
   );

   return;

  }


  container.innerHTML = "";


  if(!data.length){

   container.innerHTML =

   "<p>Aucun administrateur</p>";

   return;

  }


  data.forEach(admin => {

   container.innerHTML += `

    <div class="admin-card">

     <div>

      <strong>

       ${admin.email}

      </strong>

      <br>

      <small>

       ${admin.role}

      </small>

     </div>

    </div>

   `;

  });

 }

};

window.YouthAdmins = YouthAdmins;