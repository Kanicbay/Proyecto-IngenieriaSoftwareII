export class Transferencia{
    constructor(
        public _id: string,
        public numeroCuentaOrigen: string,
        public numeroCuentaDestino: string,
        public monto:number,
    ){}
}