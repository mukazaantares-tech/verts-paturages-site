const YouthTopbar = {

 init(){

  this.displayUser();

  this.bindLogout();

  this.toggleSidebar();

 },


 displayUser(){

  const user =
  AuthService.currentUser();

  if(!user) return;


  const name =
  user.email.split("@")[0];


  document
  .getElementById("adminName")
  .textContent = name;


  document
  .getElementById("adminRole")
  .textContent = user.role;

 },


 bindLogout(){

  document
  .getElementById("logoutBtn")
  ?.addEventListener("click", () => {

   AuthService.logout();

  });

 },


 toggleSidebar(){

  const btn =
  document.getElementById("sidebarToggle");

  const sidebar =
  document.querySelector(".sidebar");


  btn?.addEventListener("click", () => {

   sidebar.classList.toggle("open");

  });

 }

};


window.YouthTopbar = YouthTopbar;