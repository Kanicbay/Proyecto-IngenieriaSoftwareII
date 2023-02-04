'use strict'
/* Función para verificar que ingrese un nombre de usuario tenga al menos 8 caracteres, 
de los cuales al menos debe tener 3 digitos 
y sin caracteres especiales*/
function validarNombreU(username) {//, usernamesExistentes se agrega cuando exista la base de datos
    //Verifica si existe el nombre de usuario
    /*if (usernamesExistentes.includes(username)) {
      alert("El usuario ya existe");
      return false;
    }*/
    //Verifica que almenos tenga 8 caracteres
    toastr.options={
        "positionClass": "toast-top-center",
        "preventDuplicates": true
    }
    if (username.length < 8) {
      //alert("El nombre de usuario debe tener al menos 8 caracteres");
      toastr.error('El nombre de usuario debe tener al menos 8 caracteres');
      return false;
    }
    //Verifica que no ingrese caracteres especiales
    let digitCount = 0;
    for (let i = 0; i < username.length; i++) {
      if (!isNaN(username[i])) {
        digitCount++;
      } else if (username[i].match(/[^a-zA-Z0-9]/)) {
        toastr.error("El nombre de usuario no debe tener caracteres especiales");
        return false;
      }
    }
    //Verifica que tenga almenos 3 digitos
    if (digitCount < 3) {
        toastr.error("El nombre de usuario debe tener al menos 3 dígitos");
        return false;
    }
    return true;
}

/*Funcion para validar que cumpla con: tener al menos 8 posiciones de los cuales 
al menos 1 debe se letra mayúscula, 
las restantes deben ser letras minúsculas, 
números y el carácter @. */
function validarContraseña(constraseña) {
    var pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*@).{8,}$/;
    return pattern.test(constraseña);
}

//Funcion para confirmar contraseñas
function confirmarContraseña(constraseña, confirmarContraseña) {
    return constraseña === confirmarContraseña;
}

// Función para almacenar los datos del formulario
function almacenarDatos() {
  const nombreU = document.getElementById("txaCredenciales1").value;
  const constraseña = document.getElementById("txaCredenciales2").value;
  const confirmacionContraseña = document.getElementById("txaCredenciales3").value;
  /*
  if (validarNombreU(nombreU)){
    console.log("Nombres de usuario: " + nombreU);
    document.getElementById("txaCredenciales2").disabled = false;
    if(validarContraseña(constraseña)){
        console.log("Contraseña: " + constraseña);
        document.getElementById("txaCredenciales3").disabled = false;
        if(confirmarContraseña(constraseña,confirmacionContraseña)){
            console.log("Confirmar contraseña: " + confirmacionContraseña);
        }else{
            alert("Las contraseñas no coinciden");
        }
    }else{
        alert("La contraseña no cumple los requisitos");
    }
  }*/
}

let haMostradoMensaje1 = false;
let haMostradoMensaje2 = false;
let haMostradoMensaje3 = false;
//Timer cada 6 segundos para verificar ingreso de datos
let intervalo = setInterval(() => {
    const nombreUsuario = document.getElementById("txaCredenciales1").value;
    const constraseña = document.getElementById("txaCredenciales2").value;
    const confirmacionContraseña = document.getElementById("txaCredenciales3").value;
    const resultado1 = validarNombreU(nombreUsuario);
    const resultado2 = validarContraseña(constraseña);
    const resultado3 = confirmarContraseña(constraseña,confirmacionContraseña);

    toastr.options={
        "positionClass": "toast-top-center",
        "preventDuplicates": true
    }
    if (resultado1 === true){
        document.getElementById("txaCredenciales2").disabled = false;
        if(resultado2 === true) {
            document.getElementById("txaCredenciales3").disabled = false;
            if(resultado3 === true){
                document.getElementById("btnCredenciales").disabled = false;
                clearInterval(intervalo);
            }else if(resultado2 === true && haMostradoMensaje2){
                toastr.error("Las contraseñas no coinciden",{
                    "positionClass": "toast-bottom-right"
                });
            }
        }else if(resultado1 === true && haMostradoMensaje1){
            toastr.error("La contraseña no cumple los requisitos");
        } 
    }

    toastr.options={
        "positionClass": "toast-top-right",
        "timeOut": "4000",
    }
    if (resultado1 === true && !haMostradoMensaje1) {
        toastr.success("Usuario correcto");
        haMostradoMensaje1 = true;
    }

    if (resultado2 === true && !haMostradoMensaje2) {
        toastr.success("Contraseña correcto");
        haMostradoMensaje2 = true;
    }

    if (resultado2===true && resultado3===true && !haMostradoMensaje3) {
        toastr.success("Contraseñas iguales");
        haMostradoMensaje3 = true;
    }
  }, 6000);
  
// Asociar la función almacenarDatos() al botón "Crear cuenta"
document.getElementById("btnCredenciales").addEventListener("click", almacenarDatos);
