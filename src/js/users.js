import { get, deletes, update } from "./services.js";

export async function setupUsers() {
  const ul = document.getElementById("user-list");
  if (!ul) return;

  ul.innerHTML = "";

  const header = document.createElement("li");
  header.classList.add("user-header");
  header.innerHTML = `
    <span>Foto</span>
    <span>Nombre</span>
    <span>Email</span>
    <span>Teléfono</span>
    <span>Matrícula</span>
    <span>Ingreso</span>
    <span>Acciones</span>
  `;
  ul.appendChild(header);

  const users = await get("http://localhost:3000/users");

  // 🧠 Obtener usuario logueado
  const currentUser = JSON.parse(localStorage.getItem("loggedUser"));
  const isAdmin = currentUser?.role === "admin";

  users.forEach((user) => {
    const li = document.createElement("li");
    li.classList.add("user-row");

    // 🔐 Si es admin, muestra botones; si no, deja el espacio vacío
    const actionsHtml = isAdmin
      ? `
        <button class="edit-btn" data-id="${user.id}">✏️</button>
        <button class="delete-btn" data-id="${user.id}">🗑️</button>
      `
      : `<span class="no-actions">Sin permisos</span>`;

    li.innerHTML = `
      <span><img src="imgs/csgo.jpeg" alt="foto" class="user-avatar"></span>
      <span>${user.name}</span>
      <span>${user.email}</span>
      <span>${user.phone}</span>
      <span>${user.enrollNumber}</span>
      <span>${user.dateOfAdmission}</span>
      <span class="actions">
        ${actionsHtml}
      </span>
    `;
    ul.appendChild(li);
  });

  // Eventos click
  ul.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;

    // 🔒 Verificación extra de rol por si intentan usar el DOM o consola
    if (!isAdmin) {
      return Swal.fire("Sin permisos", "No puedes hacer esta acción", "error");
    }

    // 🗑️ Eliminar
    if (e.target.classList.contains("delete-btn")) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#C0392B",
        cancelButtonColor: "#2C3E50",
        confirmButtonText: "Sí, eliminarlo"
      }).then(async (result) => {
        if (result.isConfirmed) {
          const success = await deletes("http://localhost:3000/users", id);
          if (success) {
            Swal.fire("¡Eliminado!", "El usuario ha sido eliminado.", "success");
            setupUsers();
          } else {
            Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
          }
        }
      });
    }

    // ✏️ Editar
    if (e.target.classList.contains("edit-btn")) {
      const user = users.find((u) => u.id == id);

      const { value: formValues } = await Swal.fire({
        title: "Editar Usuario",
        html: `
          <input id="swal-name" class="swal2-input" placeholder="Nombre" value="${user.name}">
          <input id="swal-email" class="swal2-input" placeholder="Email" value="${user.email}">
          <input id="swal-phone" class="swal2-input" placeholder="Teléfono" value="${user.phone}">
          <input id="swal-enroll" class="swal2-input" placeholder="Matrícula" value="${user.enrollNumber}">
          <input id="swal-date" class="swal2-input" placeholder="Ingreso" value="${user.dateOfAdmission}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Guardar cambios",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
          return {
            name: document.getElementById("swal-name").value.trim(),
            email: document.getElementById("swal-email").value.trim(),
            phone: document.getElementById("swal-phone").value.trim(),
            enrollNumber: document.getElementById("swal-enroll").value.trim(),
            dateOfAdmission: document.getElementById("swal-date").value
          };
        }
      });

      if (formValues) {
        try {
          await update("http://localhost:3000/users", id, formValues);
          Swal.fire("¡Actualizado!", "Los datos del usuario han sido modificados.", "success");
          setupUsers();
        } catch (error) {
          Swal.fire("Error", "No se pudo actualizar el usuario.", "error");
        }
      }
    }
  });
}
