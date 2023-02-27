import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CargarScriptsService } from '../cargar-scripts.service';
import { Cliente } from '../models/cliente';
import { Cuenta } from '../models/cuenta';
import { Transferencia } from '../models/transferencia';
import { Usuario } from '../models/usuario';
import { CargarService } from '../services/cargar.service';
import { CuentaService } from '../services/cuenta.service';
import { Global } from '../services/global';
import { TransferenciaService } from '../services/transferencia.service';

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.css'],
  providers:[TransferenciaService, CargarService, CuentaService, CookieService]
})
export class TransferenciaComponent implements OnInit {
  public transferencia:Transferencia;
  public cuenta:Cuenta;
  public url:string;
  public idCreado:string;
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
    private _transferenciaService:TransferenciaService,
    private _router:Router,
    private _cuentaService:CuentaService,
    private _cookieService: CookieService,
    ){
    this.url=Global.url;
    this.transferencia=new Transferencia('','','',0);
    this.cuenta=new Cuenta('','','','','','','', 1); //Debe ser el de la base de datos este this.cuenta, estoy creando uno nuevo y no ocupando de la base 
    this.idCreado='';
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

  async obtenerCuentas(){
    await this._cuentaService.obtenerDatos().subscribe(
      response=>{
        this.cuentas=response.cuentas;
        this.cuentaCorriente=this.cuentas[0];
        this.cuentaAhorro=this.cuentas[1];
        this.cuentaVinculada=this.cuentas[2];
        this.cliente=response.cliente;
        this.usuario=response.usuario;

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
  

}
