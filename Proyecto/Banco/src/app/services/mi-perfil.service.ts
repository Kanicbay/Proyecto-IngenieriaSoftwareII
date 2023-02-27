import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Cuenta } from '../models/cuenta';
import { Global } from "./global";
import { Observable } from 'rxjs';
import { Usuario } from "../models/usuario";
import { Cliente } from "../models/cliente";
import { CookieService} from 'ngx-cookie-service';


@Injectable()
export class MiPerfilService{
    public url:string;
    constructor(
        private _http:HttpClient,
        private _cookieService:CookieService
    ){
        this.url=Global.url;
    }
    //crear cuenta
    //http://localhost:3700/createAccount

    actualizarDatos(usuario:Usuario, cliente: Cliente):Observable<any>{
        let params1=JSON.stringify(usuario);
        let params2=JSON.stringify(cliente);
        const cookieValue = this._cookieService.get('token');
        let headers = new HttpHeaders().set('Authorization', 'Bearer ' + cookieValue);
        return this._http.post(this.url+'updateData',{params1, params2},{headers:headers});
    }

}