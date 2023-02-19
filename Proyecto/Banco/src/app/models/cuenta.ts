export class Cuenta {
    constructor(
        public _id: string,
        public numeroCuenta: string,
        public nombres: string,
        public apellidos: string,
        public cedula: string,
        public correo: string,
        public tipoCuenta: string,
        public saldo: number
    ){}
}
