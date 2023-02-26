import { Component } from '@angular/core';
import { CargarService } from '../services/cargar.service';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario';
import { Global } from '../services/global';
import { Router, ActivatedRoute } from '@angular/router';
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
  public idCodigo:string;
  
  constructor(
    private _usuarioService:UsuarioService,
    private _cargarService:CargarService,
    private _router:Router,
    private _activatedRouter:ActivatedRoute
  ) { 
    this.url=Global.url;
    this.usuario=new Usuario('','','');
    this.status='';
    this.idCreado='';
    this.usuarioExiste=false;
    this.confirmPasswordValue='';
    this.idCodigo='';
  }

  ngOnInit(): void {
  }

  crearUsuario(form:NgForm){
    this.idCodigo = this._activatedRouter.snapshot.paramMap.get('idCodigo') || '';
    console.log(this.idCodigo);
    this._usuarioService.crearUsuario(this.usuario, this.idCodigo).subscribe(
      response=>{
        if(response.message=='Proceso Exitoso'){          
          this.status='success';
          form.reset();
          //Redirigir a la pagina de banca virtual
          this._router.navigate(['/login']);
        }else{
          this.status='failed';
        }

        
      },
      error=>{
        if(error.status==409){
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
