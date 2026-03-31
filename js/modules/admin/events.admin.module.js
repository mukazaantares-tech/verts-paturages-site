const EventsModule = {

 init(){

  console.log("EventsModule chargé");

  this.bindSave();

  this.loadEvents();

 },


 bindSave(){

  document
  .getElementById("saveEvent")
  ?.addEventListener("click", () => {

   this.createEvent();

  });

 },


 async createEvent(){

  /* =========================
     VERIFICATION ROLE
  ========================= */

  const user =
   DataService.get("vp_current_user");

  if(!user){

   alert("Veuillez vous connecter");

   return;

  }


  if(user.role !== "super-admin"){

   alert(
    "Seul le super administrateur peut publier un événement"
   );

   return;

  }


  /* =========================
     RECUPERATION DONNEES
  ========================= */

  const title =
   document.getElementById("eventTitle").value;

  const description =
   document.getElementById("eventDesc").value;

  const file =
   document.getElementById("eventImage").files[0];


  if(!title){

   alert("Titre requis");

   return;

  }


  if(!file){

   alert("Image requise");

   return;

  }


  try{

   /* =========================
      UPLOAD IMAGE
   ========================= */

   const fileName =
    Date.now()+"_"+file.name;


   const { error:uploadError } =
    await supabaseClient
     .storage
     .from("events")
     .upload(fileName,file);


   if(uploadError){

    console.error(uploadError);

    alert("Erreur upload image");

    return;

   }


   /* =========================
      URL IMAGE
   ========================= */

   const { data:urlData } =
    supabaseClient
     .storage
     .from("events")
     .getPublicUrl(fileName);


   /* =========================
      INSERT DB
   ========================= */

   const { error:insertError } =
    await supabaseClient
     .from("events")
     .insert({

      title,
      description,
      image_url:
       urlData.publicUrl

     });


   if(insertError){

    console.error(insertError);

    alert(insertError.message);

    return;

   }


   alert("Événement publié avec succès");


   this.loadEvents();


   /* reset form */

   document.getElementById("eventTitle").value = "";

   document.getElementById("eventDesc").value = "";

   document.getElementById("eventImage").value = "";


  }

  catch(err){

   console.error(err);

   alert("Erreur lors de la publication");

  }

 },


async loadEvents(){

 const container =
 document.getElementById("eventAdminList");

 const { data } =
 await supabaseClient
 .from("events")
 .select("*")
 .order("created_at",{ ascending:false });


 container.innerHTML = "";


 if(!data || data.length === 0){

  container.innerHTML = `
   <p>Aucun événement</p>
  `;

  return;

 }


 data.forEach(event => {

  // sécurité image
  const image =
   event?.image_url ||
   "https://via.placeholder.com/600x400?text=Image";


  container.innerHTML += `

  <div class="admin-event-card">

   <div class="admin-event-image">

    <img src="${image}">

   </div>

   <div class="admin-event-content">

    <h4>
     ${event.title || "Sans titre"}
    </h4>

    <button
     onclick="EventsModule.deleteEvent('${event.id}')">

     Supprimer

    </button>

   </div>

  </div>

  `;

 });

},

 async deleteEvent(id){

  const user =
   DataService.get("vp_current_user");

  if(user.role !== "super-admin"){

   alert(
    "Seul le super administrateur peut supprimer"
   );

   return;

  }


  await supabaseClient
   .from("events")
   .delete()
   .eq("id",id);


  this.loadEvents();

 }

};


window.EventsModule = EventsModule;