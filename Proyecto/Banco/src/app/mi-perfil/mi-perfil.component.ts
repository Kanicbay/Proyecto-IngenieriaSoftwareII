import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Cuenta } from '../models/cuenta';
import { Usuario } from '../models/usuario';
import { MiPerfilService } from '../services/mi-perfil.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css'],
  providers: [MiPerfilService]
})
export class MiPerfilComponent {
  public cuenta:Cuenta;
  public usuario:Usuario;
  public status:boolean;
  constructor(
    private _miPerfilService:MiPerfilService,
  ){
    this.cuenta=new Cuenta('','113790542','Daniel','Lazo','0123456789','dj@epn.com','', 0);
    this.usuario=new Usuario('','daniel1245','');
    this.status=true;//cambia a true
  }

  CambioModos(variable:boolean){
    this.status = variable;
    console.log(this.status);
    return this.status;
  }

  CambioModo(){
    if(this.status==true){
      return true;
    }else{
      return false;
    }
  }

  Editar(form:NgForm){
    this._miPerfilService.Edicion(this.usuario,this.cuenta,this.usuario._id).subscribe(
      response=>{

      },
      error=>{
        //alert("Usuario Inexistente")
        console.log(<any>error);
      }
    );
  }
}
