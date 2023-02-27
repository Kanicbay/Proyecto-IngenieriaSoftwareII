import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Cuenta } from '../models/cuenta';
import { Global } from "./global";
import { Observable } from 'rxjs';
import { Usuario } from "../models/usuario";


@Injectable()
export class MiPerfilService{
    public url:string;
    constructor(
        private _http:HttpClient
    ){
        this.url=Global.url;
    }
    //crear cuenta
    //http://localhost:3700/createAccount

    Edicion(usuario:Usuario, cuenta:Cuenta, idCodigo: String):Observable<any>{
        let params1=JSON.stringify(usuario);
        let params2=JSON.stringify(cuenta);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'editarCU/'+idCodigo, params1+params2,{headers:headers});
    }

}