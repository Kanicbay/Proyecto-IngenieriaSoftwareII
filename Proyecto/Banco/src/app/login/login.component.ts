import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Usuario } from '../models/usuario';
import { Global } from '../services/global';
import { Router, ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';
import { NgForm } from '@angular/forms';
import { CookieService} from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[LoginService]
})
export class LoginComponent {
  public usuario:Usuario;
  public url:string;
  public status:string;
  public idCreado:string;
  public usuarioExiste:boolean;
  public idCodigo:string;
  
  constructor(
    private _loginService:LoginService,
    private _router:Router,
    private _activatedRouter:ActivatedRoute,
    private _cookieService:CookieService
  ) { 
    this.url=Global.url;
    this.usuario=new Usuario('','','');
    this.status='';
    this.idCreado='';
    this.usuarioExiste=false;
    this.idCodigo='';
  }

  ngOnInit(): void {
  }

  login(form:NgForm){
    this._loginService.login(this.usuario).subscribe(
      response=>{
        console.log(response);  
        if(response.message=='Proceso exitoso'){
          this.status='success';
          form.reset();
          this._cookieService.set('token',response.token);
          //Redirigir a la pagina de banca virtual
          this._router.navigate(['/mi-cuenta']);
        }else{
          this.status='failed';
        }
      },
      error=>{
        console.log(<any>error);
        if(error.error.message=='Error!'){
          alert('Usuario o contraseña incorrectos');
        }
      }
    );
  }
}
