const ThemeModule = {

 init(){

  this.loadTheme();

  this.bindToggle();

 },


 bindToggle(){

  const btn =
   document.getElementById("themeToggle");

  if(!btn) return;


  btn.addEventListener("click", () => {

   this.toggleTheme();

  });

 },


 toggleTheme(){

  const body =
   document.body;

  body.classList.toggle("dark");


  const darkActive =
   body.classList.contains("dark");


  localStorage.setItem(

   "vp_theme",

   darkActive ? "dark" : "light"

  );


  this.updateIcon();

 },


 loadTheme(){

  const saved =
   localStorage.getItem("vp_theme");


  const prefersDark =
   window.matchMedia(

    "(prefers-color-scheme: dark)"

   ).matches;


  if(

   saved === "dark"

   ||

   (!saved && prefersDark)

  ){

   document.body.classList.add("dark");
  }

  this.updateIcon();
 },

 updateIcon(){
  const btn =
   document.getElementById("themeToggle");
  if(!btn) return;

  btn.textContent =
   document.body.classList.contains("dark")
   ? "☀️"
   : "🌙";
 }
};

window.ThemeModule = ThemeModule;
