import { get } from "./services.js";

import { navigate } from "./script.js";

export async function setupLogin() {
  const form = document.getElementById("login-form");
  const msg = document.getElementById("login-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const users = await get("http://localhost:3000/users");

    const found = users.find(
      user => user.email === email && user.password === password
    );

    if (found) {
      localStorage.setItem("loggedUser", JSON.stringify(found));
      navigate("/users");
    } else {
      msg.textContent = "Correo o contraseña incorrectos";
    }
  });
}
