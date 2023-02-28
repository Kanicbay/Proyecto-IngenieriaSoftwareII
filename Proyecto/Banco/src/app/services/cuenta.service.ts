import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Cuenta } from '../models/cuenta';
import { Global } from "./global";
import { Observable } from 'rxjs';
import { CookieService} from 'ngx-cookie-service';

@Injectable()
export class CuentaService{
    public url:string;
    constructor(
        private _http:HttpClient,
        private _cookieService:CookieService

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

    verificarCuenta(numeroCuenta: String):Observable<any>{
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(this.url+'verifyClient/'+numeroCuenta,{headers:headers});
    }

    obtenerDatos():Observable<any>{
        const cookieValue = this._cookieService.get('token');
        let headers = new HttpHeaders().set('Authorization', 'Bearer ' + cookieValue);
        const respuesta = this._http.post(this.url + 'findData', {}, { headers: headers });
        return respuesta;
    }

    envioCorreo(email:String,codigo: String){
        let params= {
            email:email,
            mensaje:codigo,
        };
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'envioCorreo',params,{headers:headers});
    }

}

