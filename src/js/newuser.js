
import { post } from "./services.js";

export function setupNewUser() {
  const form = document.getElementById("user-form");
  const msg = document.getElementById("form-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newUser = {
      name: document.getElementById("name").value.trim(),
      enrollNumber: document.getElementById("enrollNumber").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      email: document.getElementById("email").value.trim(),
      dateOfAdmission: document.getElementById("dateOfAdmission").value,
    };

    try {
      await post("http://localhost:3000/users", newUser);
      msg.textContent = "✅ Usuario agregado exitosamente";
      msg.style.color = "green";
      form.reset();
    } catch (err) {
      msg.textContent = "❌ Error al agregar usuario";
      msg.style.color = "red";
    }
  });
}
