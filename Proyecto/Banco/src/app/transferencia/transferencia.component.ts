import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.css'],
  providers:[TransferenciaService, CargarService, CuentaService, CookieService]
})
export class TransferenciaComponent implements OnInit {
  @ViewChild("cuadroNumCuenta") myInputElement!: ElementRef<HTMLInputElement>;
  public transferencia:Transferencia;
  public cuenta:Cuenta;
  public url:string;
  public idCreado:string;
  public usuario:Usuario;
  public status:boolean;
  public status2:boolean;
  public status3:boolean;
  public cliente:Cliente;
  public cuentas:Cuenta[];
  public cuentaCorriente:Cuenta;
  public cuentaAhorro:Cuenta;
  public cuentaVinculada:Cuenta;
  public usuarioActualizado:Usuario;
  public actualizarDatos:boolean;
  public clienteActualizado:Cliente;
  public clienteExiste:boolean;
  public clienteIngreso:boolean;
  public tipoCuenta:number;
  timeout: any;
  constructor(
    private _transferenciaService:TransferenciaService,
    private _router:Router,
    private _cuentaService:CuentaService,
    private _cookieService: CookieService,
    private _CargaScritps:CargarScriptsService,
    private _Activeroute: ActivatedRoute
    ){
    this.url=Global.url;
    this.transferencia=new Transferencia('','','',0);
    this.cuenta=new Cuenta('','','','','','','', 0); //Debe ser el de la base de datos este this.cuenta, estoy creando uno nuevo y no ocupando de la base 
    this.idCreado='';
    this.cuenta=new Cuenta('','','','','','','', 0);
    this.usuario=new Usuario('','','');
    this.usuarioActualizado=new Usuario('','','');
    this.status=false;//cambia a true
    this.status2=false;
    this.status3=false;
    this.cliente=new Cliente('','','','','','','','');
    this.clienteActualizado=new Cliente('','','','','','','','');
    this.cuentas=[];
    this.cuentaCorriente=new Cuenta('','','','','','','', 0);
    this.cuentaAhorro=new Cuenta('','','','','','','', 0);
    this.cuentaVinculada=new Cuenta('','','','','','','', 0);
    this.actualizarDatos=false;
    this.clienteExiste=false;
    this.clienteIngreso=false;
    this.tipoCuenta=0;
  }

  ngOnInit(): void {
    this.obtenerCuentas();
    this._Activeroute.queryParams.subscribe(params => {
      this.tipoCuenta = params['tipoCuenta'];
    });
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
        console.log(this.cuentas[this.tipoCuenta-1].saldo);
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

  MontoEvent(event: any){
    if(this.timeout != null){
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.transferencia.monto=event.target.value;
      const MAX_MONTO = 1200;
      if (this.transferencia.monto <= MAX_MONTO && this.transferencia.monto!=0 && this.transferencia.monto <= this.cuentas[this.tipoCuenta-1].saldo) {
        console.log(event.target.value);
            //document.getElementById("cuadroNumCuenta")!.disable = false;
            //this.myInputElement.nativeElement.disabled = false;
        this.status = true;
        clearTimeout(this.timeout);
      } else { 
            //document.getElementById("cuadroNumCuenta")!.hidden = true; 
            //this.myInputElement.nativeElement.disabled = true; 
        if (this.transferencia.monto >= MAX_MONTO && this.transferencia.monto <= this.cuentas[this.tipoCuenta-1].saldo && this.transferencia.monto!=0)
          console.log("El monto máximo por transacción diaria es de 5000 dólares");
        if (this.transferencia.monto >= this.cuentaCorriente.saldo)
          console.log("No dispone los fondos suficientes en su cuenta");
        if (this.transferencia.monto==0)
          console.log("No se ha ingresado ningun valor"); 
        this.status = false;   
        }
    },100);     
  } 

  CuentaEvent(event: any){
    if(this.timeout != null){
      clearTimeout(this.timeout);
    }
    this.clienteIngreso=true;
    this.timeout = setTimeout(() => {
      this.transferencia.numeroCuentaDestino = event.target.value;
      if (this.transferencia.numeroCuentaDestino.length >= 8 && this.transferencia.numeroCuentaDestino.length <= 10 && this.transferencia.numeroCuentaDestino != this.cuentas[this.tipoCuenta-1].numeroCuenta) {
        this.status2 = true;
        console.log(event.target.value);
        clearTimeout(this.timeout);
      }else{
        console.log("El numero de cuenta debe estar entre 8 a 10 numeros");
        this.status2 = false;
      }
    },100);  
  }
  
  async verificarCuenta(){
    await this._transferenciaService.verificarCuenta(this.transferencia.numeroCuentaDestino).subscribe(
      response=>{
        console.log(response);
        if(response.message = 'Proceso exitoso'){
          this.clienteExiste=true;
          this.status3=true;
        }
      },
      error=>{
        console.log("Este es el error",error);
        this.clienteExiste=false;
        this.status3=false;
        if(error.error.auth == false){
          alert("La sesión caducó");
          this._cookieService.delete('token');
          this._router.navigate(['/login',]);
        }
      }
    );
  }
  
  transferirDinero(){
    if(this.clienteExiste){
      console.log(this.tipoCuenta);
      switch(this.tipoCuenta-1) {
        case 0:
        this._transferenciaService.transferir(this.cuentas[this.tipoCuenta-1].numeroCuenta,this.transferencia.numeroCuentaDestino, this.transferencia.monto, "Ahorros").subscribe(
        response=>{
          if(response.message = 'Proceso exitoso'){
            alert("Transferencia exitosa");
            window.location.reload();
          }
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
      break;
      case 1:
        this._transferenciaService.transferir(this.cuentas[this.tipoCuenta-1].numeroCuenta,this.transferencia.numeroCuentaDestino, this.transferencia.monto, "Corriente").subscribe(  
          response=>{
            if(response.message = 'Proceso exitoso'){
              alert("Transferencia exitosa");
              window.location.reload();
            }
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
        break;
        case 2:
          this._transferenciaService.transferir(this.cuentas[this.tipoCuenta-1].numeroCuenta,this.transferencia.numeroCuentaDestino, this.transferencia.monto, "Vinculada").subscribe(
            response=>{
              if(response.message = 'Proceso exitoso'){
                alert("Transferencia exitosa");
                window.location.reload();
              }
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
          break;
        default:
          console.log("No se ha seleccionado ninguna cuenta");
          break;
      }
    }
  }
  
  async cerrarSesion(){
    await this._cookieService.deleteAll();
  }

}
