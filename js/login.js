async function ingresar(){

    const correo = document.getElementById("correo").value;
    const clave = document.getElementById("clave").value;

    const { error } =
    await supabase.auth.signInWithPassword({
        email: correo,
        password: clave
    });

    if(error){
        alert(error.message);
    }else{
        alert("Bienvenida");
        window.location.href="index.html";
    }
}