/* =================================
GLOBAL RESPONSIVE NAVBAR
fonctionne pour tout le site
================================= */

const GlobalResponsive = {

 init(){

  console.log(
   "global responsive actif"
  );

  this.initBurger();

  this.autoCloseMenu();

 },


 /* =============================
 BURGER UNIVERSAL
 ============================= */

 initBurger(){

  const burgers =
   document.querySelectorAll(".burger");

  const navs =
   document.querySelectorAll(".nav-links");


  if(!burgers.length || !navs.length){

   console.warn(
    "burger ou nav-links absent"
   );

   return;

  }


  burgers.forEach(burger => {

   burger.addEventListener("click", e => {

    e.stopPropagation();

    navs.forEach(nav => {

     nav.classList.toggle("open");

    });

   });

  });


 },


 /* =============================
 AUTO CLOSE
 ============================= */

 autoCloseMenu(){

  document.addEventListener("click", e => {

   const clickedBurger =
    e.target.closest(".burger");

   const clickedMenu =
    e.target.closest(".nav-links");


   if(!clickedBurger && !clickedMenu){

    document
    .querySelectorAll(".nav-links")
    .forEach(nav => {

     nav.classList.remove("open");

    });

   }

  });


  /* ferme menu après clic lien */

  document
  .querySelectorAll(".nav-links a")
  .forEach(link => {

   link.addEventListener("click", () => {

    document
    .querySelectorAll(".nav-links")
    .forEach(nav => {

     nav.classList.remove("open");

    });

   });

  });

 }

};


/* rend accessible partout */

window.GlobalResponsive =
 GlobalResponsive;

 /* =============================
   DARK MODE SIMPLE
============================= */

document.addEventListener("DOMContentLoaded", () => {

 const toggle =
  document.getElementById("themeToggle");

 if(!toggle) return;


 /* restaurer thème */

 if(localStorage.getItem("vp_theme") === "dark"){

  document.body.classList.add("dark");

 }


 /* clic bouton */

 toggle.addEventListener("click", () => {

  document.body.classList.toggle("dark");


  if(document.body.classList.contains("dark")){

   localStorage.setItem("vp_theme","dark");

   toggle.textContent = "☀️";

  }

  else{

   localStorage.setItem("vp_theme","light");

   toggle.textContent = "🌙";

  }

 });


 /* icône correcte au chargement */

 if(document.body.classList.contains("dark")){

  toggle.textContent = "☀️";

 }

});

/* =============================
   DARK MODE GLOBAL FINAL
============================= */

(function(){

 function initTheme(){

  const toggle =
   document.getElementById("themeToggle");

  if(!toggle) return;


  /* charger thème sauvegardé */

  const savedTheme =
   localStorage.getItem("vp_theme");

  if(savedTheme === "dark"){

   document.documentElement.classList.add("dark");

  }


  /* mettre bonne icône */

  updateIcon();


  /* clic bouton */

  toggle.addEventListener("click", () => {

   document.documentElement.classList.toggle("dark");

   const isDark =
    document.documentElement.classList.contains("dark");

   localStorage.setItem(
    "vp_theme",
    isDark ? "dark" : "light"
   );

   updateIcon();

  });

 }


 function updateIcon(){

  const toggle =
   document.getElementById("themeToggle");

  if(!toggle) return;

  toggle.textContent =
   document.documentElement.classList.contains("dark")
   ? "☀️"
   : "🌙";

 }


 document.addEventListener(
  "DOMContentLoaded",
  initTheme
 );

})();