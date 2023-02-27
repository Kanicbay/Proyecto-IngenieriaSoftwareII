export class Cliente {
    constructor(
        public _id: string,
        public cedula: string,
        public nombres: string,
        public apellidos: string,
        public correo: string,
        public cuentaCorriente: string,
        public cuentaAhorros: string,
        public cuentaVinculada: string
    ){}
}
