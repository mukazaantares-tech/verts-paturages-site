const ConseilResponsive = {

 init(){

  console.log(
   "Conseil responsive chargé"
  );

  this.initBurger();

  this.autoCloseMenu();

 },


 initBurger(){

  const burger =
   document.getElementById("burger");

  const nav =
   document.getElementById("navLinks");


  if(!burger || !nav) return;


  burger.addEventListener("click",()=>{

   nav.classList.toggle("open");

  });

 },


 autoCloseMenu(){

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

window.ConseilResponsive =
 ConseilResponsive;