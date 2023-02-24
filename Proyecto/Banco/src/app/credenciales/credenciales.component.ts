import { Component } from '@angular/core';
import { CargarService } from '../services/cargar.service';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario';
import { Global } from '../services/global';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-credenciales',
  templateUrl: './credenciales.component.html',
  styleUrls: ['./credenciales.component.css'],
  providers:[UsuarioService, CargarService]
})
export class CredencialesComponent {
  public usuario:Usuario;
  public url:string;
  public status:string;
  public idCreado:string;
  public usuarioExiste:boolean;
  public confirmPasswordValue:string;
  
  constructor(
    private _usuarioService:UsuarioService,
    private _cargarService:CargarService,
    private _router:Router,
  ) { 
    this.url=Global.url;
    this.usuario=new Usuario('','','');
    this.status='';
    this.idCreado='';
    this.usuarioExiste=false;
    this.confirmPasswordValue='';
  }

  ngOnInit(): void {
  }

  crearUsuario(form:NgForm){
    this._usuarioService.crearUsuario(this.usuario).subscribe(
      response=>{
        if(response.usuario){
          this._cargarService.peticionRequest(Global.url+"createUser/"+response.user._id,[],[],'foto')
          .then((result:any)=>{
            this.status='success';
            this.idCreado=result.usuario._id;
          });
        }else{
          this.status='failed';
        }
        //Redirigir a la pagina de banca virtual
        //this._router.navigate(['/credenciales']);
        form.reset();
      },
      error=>{
        if(error.status==400){
          this.status='El nombre de usuario ya existe';
          this.usuarioExiste=true;
          form.reset();
          timer(3000).subscribe(()=>this.usuarioExiste=false);
        }else{
          console.log(<any>error);
        }
      }
    );
  }

  contrasenaCoincide(){
    if(this.usuario.contrasena==this.confirmPasswordValue){
      return true;
    }else{
      return false;
    }
  }
  
  //Cuando hagas el router mandale aca this._router.navigate(['/mi-cuenta']);
}
