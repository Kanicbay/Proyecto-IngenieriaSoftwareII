import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Cuenta } from '../models/cuenta';
import { Global } from "./global";
import { Observable } from 'rxjs';


@Injectable()
export class TransferenciaService{
    public url:string;
    constructor(
        private _http:HttpClient
    ){
        this.url=Global.url;
    }
    //crear cuenta
    //http://localhost:3700/createAccount
    obtenerCuenta(numeroCuenta:string):Observable<any>{
        let params=JSON.stringify(numeroCuenta);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(this.url+'findAccount', {headers:headers});
    }
    transferir(cuenta:Cuenta):Observable<any>{
        let params=JSON.stringify(cuenta);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'transfer',params,{headers:headers});
    }   

}

