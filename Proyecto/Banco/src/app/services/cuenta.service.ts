import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Cuenta } from '../models/cuenta';
import { Global } from "./global";
import { Observable } from 'rxjs';

@Injectable()
export class CuentaService{
    public url:string;
    constructor(
        private _http:HttpClient
    ){
        this.url=Global.url;
    }
    //crear cuenta
    //http://localhost:3700/createAccount
    crearCuenta(cuenta:Cuenta):Observable<any>{
        let params=JSON.stringify(cuenta);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'createAccount',params,{headers:headers});
    }

    verificarCliente(cedula: String):Observable<any>{
        let params=JSON.stringify(cedula);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'verifyClient',params,{headers:headers});
    }

    crearCodigoVerificacion(cedula: String):Observable<any>{
        let params=JSON.stringify({cedula: cedula});
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'createCode',params,{headers:headers});
    }

    verificarCodigoVerificacion(codigo: String):Observable<any>{
        let headers=new HttpHeaders().set('Content-Type','application/json');
        console.log(this.url+'verifyCode/'+codigo);
        return this._http.get(this.url+'verifyCode/'+codigo,{headers:headers});
    }

}

