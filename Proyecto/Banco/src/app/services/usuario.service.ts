import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Usuario } from '../models/usuario';
import { Global } from "./global";
import { Observable } from 'rxjs';

@Injectable()
export class UsuarioService{
    public url:string;
    constructor(
        private _http:HttpClient
    ){
        this.url=Global.url;
    }
    //crear cuenta
    //http://localhost:3700/createAccount
    crearUsuario(usuario:Usuario):Observable<any>{
        let params=JSON.stringify(usuario);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'createUser',params,{headers:headers});
    }
}

