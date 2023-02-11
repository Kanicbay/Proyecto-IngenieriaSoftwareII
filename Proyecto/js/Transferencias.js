let saldo = 100;//sacar de la base de datos
let $Fmonto = document.getElementById("cuadroMonto");
let $FnumeroC = document.getElementById("cuadroNumCuenta");
let timeout;
let monto;
let numeroC;

//Funcion para validar numero de cuenta
function validarNumeroCuenta(cuenta) {
    //crear una funcion que vea en la base de datos si existe el numero de cuenta ingresado
    //Si cumple que se active el boton de transferencia (document.getElementById("btnTransferir").disabled = false;)
}

//Funcion para transferir
function transferencia(cuenta) {
    const nuevoSaldo = saldo - monto;
    saldo = nuevoSaldo;
    //cuenta (put del monto al saldo del numero de la cuenta) osea SaldoTransferido = monto + saldo del numero de cuenta
    console.log("Recibo de la transacción: ", monto, "dólares"); //agregar depositados a la cuenta tal...
    console.log("Nuevo saldo: ", nuevoSaldo, "dólares");
}

//Evento que cuando deje de escribir verifica que cumpla las condiciones
$Fmonto.addEventListener('keydown', () => {
    //cada 3 segundos se verifica si a dejado de escribir
    timeout = setTimeout(() => {
        monto = document.getElementById("cuadroMonto").value;
        const MAX_MONTO = 5000;
        if (monto <= MAX_MONTO && monto <= saldo && monto!=0) {
            toastr.options={
                "positionClass": "toast-top-right",
                "preventDuplicates": true,
                "timeOut": "1500",
            }
            toastr.success("Monto correcto");
            document.getElementById("cuadroNumCuenta").disabled = false;
            clearTimeout(timeout);
        } else {
            toastr.options={
                "positionClass": "toast-top-center",
                "preventDuplicates": true,
                "timeOut": "1500",
            }
            if (monto >= MAX_MONTO && monto <= saldo && monto!=0)
                toastr.error("El monto máximo por transacción diaria es de 5000 dólares");
            if (monto >= saldo)
                toastr.error("No dispone los fondos suficientes en su cuenta");
            if (monto==0)
                toastr.error("No se ha ingresado ningun valor");
            document.getElementById("cuadroNumCuenta").disabled = true;              
        }
    }, 3000);    
})

//Evento que cuando deje de escribir verifica que cumpla las condiciones
$FnumeroC.addEventListener('keydown', () => {
    //cada segundo verifica si a dejado de escribir
    timeout = setTimeout(() => {
        numeroC = document.getElementById("cuadroNumCuenta").value;
        if (numeroC.length >= 8 && numeroC.length <= 10 && !isNaN(numeroC)) {
            document.getElementById("btnVerificar").disabled = false;
            clearTimeout(timeout);
        }else{
            toastr.options={
                "positionClass": "toast-top-center",
                "preventDuplicates": true,
                "timeOut": "1500",
            }
            toastr.error("El numero de cuenta debe estar entre 8 a 10 numeros");
            document.getElementById("btnVerificar").disabled = true;
        }
    }, 1000);    
})

document.getElementById("btnVerificar").addEventListener("click", validarNumeroCuenta);
document.getElementById("btnTransferir").addEventListener("click", transferencia);
