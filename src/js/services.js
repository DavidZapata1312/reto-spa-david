export async function get(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error en GET:", error);
  }
}

export async function post(url, body) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body) 
    });

    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error en POST:", error);
  }
}



export async function update(url, id, body) {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body) // body debe ser un objeto como { title, body, userId }
    });

    const data = await response.json();
    console.log("PUT actualizado:", data);
    return data;
  } catch (error) {
    console.error("Error en PUT:", error);
    throw error;
  }
}

export async function deletes(url, id) {
  try {
    const response = await fetch( `${url}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      console.log("DELETE: recurso eliminado correctamente");
      return true;
    } else {
      console.error("Error al eliminar");
      return false;
    }
  } catch (error) {
    console.error("Error en DELETE:", error);
    throw error;
  }
}