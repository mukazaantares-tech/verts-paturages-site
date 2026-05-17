const DepartementsResponsive = {

 init(){

  console.log("Departements responsive chargé");

  this.initBurger();
  this.autoClose();

 },


 initBurger(){

  const burger =
   document.getElementById("burger");

  const nav =
   document.getElementById("navLinks");

  if(!burger || !nav){

   console.warn("burger ou navLinks manquant");

   return;

  }


  burger.addEventListener("click",()=>{

   nav.classList.toggle("open");

  });

 },


 autoClose(){

  document
  .querySelectorAll(".nav-links a")
  .forEach(link=>{

   link.addEventListener("click",()=>{

    document
    .getElementById("navLinks")
    ?.classList.remove("open");

   });

  });

 }

};

window.DepartementsResponsive =
 DepartementsResponsive;