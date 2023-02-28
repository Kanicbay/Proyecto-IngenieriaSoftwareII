import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Cuenta } from '../models/cuenta';
import { Global } from "./global";
import { Observable } from 'rxjs';
import { CookieService} from 'ngx-cookie-service'; 


@Injectable()
export class TransferenciaService{
    public url:string;
    constructor(
        private _http:HttpClient,
        private _cookieService:CookieService
    ){
        this.url=Global.url;
    }
    //crear cuenta
    //http://localhost:3700/createAccount

    verificarCuenta(numeroCuenta:string):Observable<any>{
        let params=JSON.stringify({numeroCuenta: numeroCuenta});
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'verifyClient',params,{headers:headers});
    }

    transferir(cuenta:String):Observable<any>{
        let params=JSON.stringify(cuenta);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'transfer',params,{headers:headers});
    }   

}

