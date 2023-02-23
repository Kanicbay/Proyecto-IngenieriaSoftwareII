function generarTarjetaVisaAletoria() {
  const bin = '4'; // BIN de Visa
  const longitud = 16; // Longitud de la tarjeta de crédito
  
  // Generar un número aleatorio con los primeros 15 dígitos de la tarjeta
  let numeroTarjeta = bin;
  let numero = bin;
  for (let i = 1; i < longitud - 1; i++) {
    const digito = Math.floor(Math.random() * 10);
    numeroTarjeta += digito;
    numero += digito;
    if (numero.length === 4 || numero.length === 9 || numero.length === 14) {
      numero += " "; // agregar espacio después de cada grupo de 4 dígitos
    }
  }
  
  // Calcular el dígito de verificación usando el algoritmo de Luhn
  let suma = 0;
  for (let i = longitud - 2; i >= 0; i--) {
    let digito = Number(numeroTarjeta[i]);
    if ((longitud - i) % 2 === 0) {
      digito *= 2;
      if (digito > 9) {
        digito -= 9;
      }
    }
    suma += digito;
  }
  const digitoVerificacion = (10 - (suma % 10)) % 10;
  
  // Combinar los primeros 15 dígitos y el dígito de verificación para obtener el número de tarjeta completo
  numeroTarjeta += digitoVerificacion;
  numero += digitoVerificacion;
  console.log("Numero de tarjeta: " +numeroTarjeta);
  console.log("Numero de tarjeta: " +numero);
  return numeroTarjeta;
}
//let saldo = generarTarjetaVisaAletoria();
function generarTarjetaVisaNumeroCuenta(numCuenta) {
  const bin = '4'; // BIN de Visa
  const longitud = 16; // Longitud de la tarjeta de crédito

  let numeroArray = numCuenta.split(''); // Convertir a un array de caracteres
  for (let i = 0; i < numCuenta.length; i++) {
    numeroArray[i] = Number(numeroArray[i]) + 3; // agregar espacio después de cada grupo de 4 dígitos
    if (numeroArray[i] > 9) {
      numeroArray[i] -= 9;
    }
  }
  numCuenta = numeroArray.join('');  // Convertir de vuelta a un string

  let numeroTarjeta = bin + numCuenta;
  let cantidadD = numeroTarjeta.length;
  // Generar dígitos aleatorios faltantes para el número de tarjeta (excepto el ultimo)
  for (let i = cantidadD; i < longitud - 1; i++) {
    const digito = Math.floor(Math.random() * 10);
    numeroTarjeta += digito;
  }
  
  // Calcular el dígito de verificación (ultimo digito de la tarjeta) usando el algoritmo de Luhn
  let suma = 0;
  for (let i = longitud - 2; i >= 0; i--) {
    let digito = Number(numeroTarjeta[i]);
    if ((longitud - i) % 2 === 0) {
      digito *= 2;
      if (digito > 9) {
        digito -= 9;
      }
    }
    suma += digito;
  }
  
  const digitoVerificacion = (10 - (suma % 10)) % 10;

  numeroArray = numeroTarjeta.split(''); // Convertir a un array de caracteres
  for (let i = 0; i < longitud - 1; i++) {
    if ((i+1) % 4 === 0) {
      numeroArray[i] += " "; // agregar espacio después de cada grupo de 4 dígitos
    }
  }
  numeroTarjeta = numeroArray.join('');  // Convertir de vuelta a un string

  // Combinar los primeros 15 dígitos y el dígito de verificación para obtener el número de tarjeta completo
  numeroTarjeta += digitoVerificacion;
  console.log("Numero de tarjeta: " +numeroTarjeta);
  return numeroTarjeta;
}
let numeroC = "1054999607";
let saldo = generarTarjetaVisaNumeroCuenta(numeroC);
function luhn(value) {
  // Accept only digits, dashes or spaces
  if (/[^0-9-\s]+/.test(value)) return false;
  // The Luhn Algorithm. It's so pretty.
  let nCheck = 0, bEven = false;
  value = value.replace(/\D/g, "");
  for (var n = value.length - 1; n >= 0; n--) {
      var cDigit = value.charAt(n),
      nDigit = parseInt(cDigit, 10);
      if (bEven && (nDigit *= 2) > 9) nDigit -= 9; nCheck +=  nDigit; bEven = !bEven;
      console.log("numero: " + nCheck);
  }
  console.log((nCheck % 10) == 0);
  return (nCheck % 10) == 0;
}
luhn(saldo);