const routes = {
  "/": "src/html/users.html",
  "/users": "src/html/users.html",
  "/newuser": "src/html/newuser.html",
  "/about": "src/html/about.html",
};

document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.getAttribute("href"));
  }
});

async function navigate(pathname) {
  const route = routes[pathname];
  const html = await fetch(route).then((res) => res.text());
  document.getElementById("content").innerHTML = html;
  history.pushState({}, "", pathname);


  if (pathname === "/users") {
    try {
      const { setupUsers } = await import("./users.js");
      setupUsers();
    } catch (err) {
      console.error("Error cargando los usuarios:", err);
    }
  }
  if (pathname === "/newuser") {
    try {
      const { setupNewUser } = await import("./newuser.js");
      setupNewUser();
    } catch (err) {
      console.error("Error cargando el formulario:", err);
    }
  }
}

window.addEventListener("popstate", () => navigate(location.pathname));
