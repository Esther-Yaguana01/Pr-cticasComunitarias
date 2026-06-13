async function registrar() {
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const clave = document.getElementById("clave").value.trim();

  if (!nombre || !correo || !clave) {
    alert("Completa todos los campos");
    return;
  }

  try {
    const { data, error } = await window.supabaseClient.auth.signUp({
      email: correo,
      password: clave
    });

    if (error) {
      alert("Error: " + error.message);
      console.log(error);
      return;
    }

    alert("Usuario registrado ✔");
    console.log(data);

    document.getElementById("nombre").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("clave").value = "";

  } catch (err) {
    console.log("ERROR GENERAL:", err);
    alert("Error inesperado");
  }
}