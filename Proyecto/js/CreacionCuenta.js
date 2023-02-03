'use strict'
// Función para verificar que ingrese un nombre solo con letras
function verificarNombre(nombre) {
  // Utilice un bucle para recorrer cada carácter de la cédula
  for (let i = 0; i < nombre.length; i++) {
    // Obtenga el carácter en la posición actual
    let caracter = nombre.charAt(i);
    // Verifique si el carácter no es un número
    if (isNaN(caracter)) {
      return true;
    }
  }
}

// Función para verificar si una cédula es válida
function verificarCedula(cedula) {
    // Utilice un bucle para recorrer cada carácter de la cédula
    for (let i = 0; i < cedula.length; i++) {
      // Obtenga el carácter en la posición actual
      let caracter = cedula.charAt(i);
      // Verifique si el carácter no es un número
      if (isNaN(caracter)) {
        return false;
      }
    }
    // Si la cédula consta solo de números y el tamaño es correcto
    if (cedula.length === 10) {
      return true;
    }
    return false;
  }

// Función para verificar si un correo electronico es valido
function verificarEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
  
//Funcion para redirigir a otra pagina web
function redirigir(url) {
  window.location.href=url;
}

// Función para almacenar los datos del formulario
function almacenarDatos() {
  const nombres = document.getElementById("txaCrear1").value;
  const apellidos = document.getElementById("txaCrear2").value;
  const cedula = document.getElementById("txaCrear3").value;
  const correo = document.getElementById("txaCrear4").value;
  
  // Verificar si la cédula es válida
  if (verificarNombre(nombres)){
    console.log("Nombres: " + nombres);
    if (verificarNombre(apellidos)){
      console.log("Apellidos: " + apellidos);
      if (verificarCedula(cedula)) {
        console.log("Cédula: " + cedula);
        if (verificarEmail(correo)) {
          console.log("Correo: " + correo);
          redirigir("crearCredenciales.html");
        } else{
          alert("Correo inválido");
        }
      } else{
        alert("Cédula inválida");
      }
    } else{
      alert("Apellido inválido");
    }
  } else{
    alert("Nombre inválido");
  }
}
  
// Asociar la función almacenarDatos() al botón "Crear cuenta"
document.getElementById("btnCrear4").addEventListener("click", almacenarDatos);
