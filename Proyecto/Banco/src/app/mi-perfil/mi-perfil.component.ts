import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Cuenta } from '../models/cuenta';
import { Usuario } from '../models/usuario';
import { MiPerfilService } from '../services/mi-perfil.service';
import { CuentaService } from '../services/cuenta.service';
import { CargarService } from '../services/cargar.service';
import { Cliente } from '../models/cliente';
import { CookieService} from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css'],
  providers: [MiPerfilService, CuentaService, CargarService, CookieService]
})
export class MiPerfilComponent implements OnInit {
  public cuenta:Cuenta;
  public usuario:Usuario;
  public status:boolean;
  public cliente:Cliente;
  public cuentas:Cuenta[];
  public cuentaCorriente:Cuenta;
  public cuentaAhorro:Cuenta;
  public cuentaVinculada:Cuenta;
  public usuarioActualizado:Usuario;
  public actualizarDatos:boolean;
  public clienteActualizado:Cliente;

  constructor(
    private _miPerfilService:MiPerfilService,
    private _cuentaService:CuentaService,
    private _cookieService: CookieService,
    private _router:Router,
    private _location:Location

  ){
    this.cuenta=new Cuenta('','','','','','','', 0);
    this.usuario=new Usuario('','','');
    this.usuarioActualizado=new Usuario('','','');
    this.status=true;//cambia a true
    this.cliente=new Cliente('','','','','','','','');
    this.clienteActualizado=new Cliente('','','','','','','','');
    this.cuentas=[];
    this.cuentaCorriente=new Cuenta('','','','','','','', 0);
    this.cuentaAhorro=new Cuenta('','','','','','','', 0);
    this.cuentaVinculada=new Cuenta('','','','','','','', 0);
    this.actualizarDatos=false;
  }

  ngOnInit(): void {
    this.obtenerCuentas();
  }

  async editarDatosMiperfil(form:NgForm){
   
    console.log("Entre a editar datos");
    console.log(this.usuario)
   
    console.log("Estos son los datos que traigo del frontend",this.usuarioActualizado.usuario,this.usuarioActualizado.contrasena);
    await this._miPerfilService.actualizarDatos(this.usuarioActualizado).subscribe(
      response=>{
        if(response.message = "Proceso exitoso"){
          alert("Datos Actualizados");
          this.actualizarDatos=false;
          this.status=true;
          this.refreshPage();
        }
      },
      error=>{
        if(error.error.message == 'Debe ingresar datos distintos a los actuales'){
          alert("Error el usuario ya existe");
        }
        if(error.error.message == "Error los datos ingresados son iguales a los actuales"){
          alert("Error los datos ingresados son iguales a los actuales");
        }
        console.log("Este es el error",error);
        if(error.error.auth == false){
          alert("La sesión caducó");
          this._cookieService.delete('token');
          this._router.navigate(['/login',]);
        }
      }
    );
  }

  async obtenerCuentas(){
    await this._cuentaService.obtenerDatos().subscribe(
      response=>{
        this.cuentas=response.cuentas;
        this.cuentaCorriente=this.cuentas[0];
        this.cuentaAhorro=this.cuentas[1];
        this.cuentaVinculada=this.cuentas[2];
        this.cliente=response.cliente;
        this.usuario.usuario=response.usuario;

        console.log(this.cuentas, this.cliente);
      },
      error=>{
        console.log("Este es el error",error);
        if(error.error.auth == false){
          alert("La sesión caducó");
          this._cookieService.delete('token');
          this._router.navigate(['/login',]);
        }
      }
    );
  }
  
  async cerrarSesion(){
    await this._cookieService.deleteAll();
  }

  refreshPage() {
    this._location.go(this._location.path());
    window.location.reload();
  }

}
