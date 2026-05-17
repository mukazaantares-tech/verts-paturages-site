const AccueilModule = {

init(){

 this.initJoinModal();

 this.initYouthLoginModal();

},



/* =============================
   MODAL ADHESION
============================= */

initJoinModal(){

 const joinBtn =
 document.getElementById("joinBtn");

 const joinModal =
 document.getElementById("joinModal");

 const closeModal =
 document.getElementById("closeModal");


 if(!joinBtn || !joinModal) return;


 joinBtn.addEventListener("click", () => {

  joinModal.classList.remove("hidden");

 });


 closeModal?.addEventListener("click", () => {

  joinModal.classList.add("hidden");

 });

},



/* =============================
   MODAL LOGIN JEUNESSE
============================= */

initYouthLoginModal(){

 const openBtn =
 document.getElementById("youthLoginBtn");

 const modal =
 document.getElementById("youthLoginModal");

 const closeBtn =
 document.getElementById("closeYouthModal");

 const submitBtn =
 document.getElementById("submitYouthLogin");


 if(!openBtn || !modal) return;



/* ouvrir */

 openBtn.addEventListener("click", () => {

  modal.classList.remove("hidden");

 });



/* fermer */

 closeBtn?.addEventListener("click", () => {

  modal.classList.add("hidden");

 });



/* login */

 submitBtn?.addEventListener("click",

 async () => {

  const email =
  document
  .getElementById("youthEmail")
  ?.value;

  const password =
  document
  .getElementById("youthPassword")
  ?.value;



  if(!email || !password){

   document
   .getElementById("youthLoginError")
   .textContent =
   "Veuillez remplir tous les champs";

   return;

  }



  const success =
  await AuthService.login(
   email,
   password
  );



  if(!success){

   document
   .getElementById("youthLoginError")
   .textContent =
   "Email ou mot de passe incorrect";

   return;

  }



  const user =
  AuthService.currentUser();



  if(

   user.role !== "youth-admin"
   &&
   user.role !== "youth-super-admin"
   &&
   user.role !== "super-admin"

  ){

   document
   .getElementById("youthLoginError")
   .textContent =
   "Accès refusé";

   return;

  }



  modal.classList.add("hidden");



  window.location.href =
  "Jeunesse-admin.html";

 });

}

}