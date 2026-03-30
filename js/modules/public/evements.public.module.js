const EventsPublic = {

 async init(){

  console.log(
   "EventsPublic chargé"
  );

  await this.loadEvent();

 },

 async loadEvent(){

  const container =
   document.getElementById("eventCard");


  const { data } =
   await supabaseClient
   .from("events")
   .select("*")
   .order("created_at",{ ascending:false })
   .limit(1);


  if(!data || !data.length){

   container.innerHTML = `

            <div class="event-card">

            <div class="event-image">

            <img src="${data.image_url}">

            </div>

            <div class="event-content">

            <h3>
            ${data.title}
            </h3>

            <p>
            ${data.description}
            </p>

            </div>

            </div>

            `;

         }


  const event = data[0];


  container.innerHTML = `

   <img src="${event.image_url}">

   <h3>${event.title}</h3>

   <p>${event.description}</p>

  `;

 }

};

window.EventsPublic =
 EventsPublic;