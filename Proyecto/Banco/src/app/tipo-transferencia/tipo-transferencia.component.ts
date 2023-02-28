import { Component } from '@angular/core';
import { CuentaService } from '../services/cuenta.service';
import { CargarService } from '../services/cargar.service';
import { Cuenta } from '../models/cuenta';
import { Cliente } from '../models/cliente';
import { CookieService} from 'ngx-cookie-service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-tipo-transferencia',
  templateUrl: './tipo-transferencia.component.html',
  styleUrls: ['./tipo-transferencia.component.css'],
  providers:[CuentaService, CargarService, CookieService]
})
export class TipoTransferenciaComponent {
  public cliente:Cliente;
  public cuentas:Cuenta[];
  public cuentaCorriente:Cuenta;
  public cuentaAhorro:Cuenta;
  public cuentaVinculada:Cuenta;
  public tipoCuentaA:boolean;
  public tipoCuentaC:boolean;
  public tipoCuentaV:boolean;

  constructor(
    private _cuentaService:CuentaService,
    private _cookieService: CookieService,
    private _router:Router
  ) { 
    this.cliente=new Cliente('','','','','','','','');
    this.cuentas=[];
    this.cuentaCorriente=new Cuenta('','','','','','','', 0);
    this.cuentaAhorro=new Cuenta('','','','','','','', 0);
    this.cuentaVinculada=new Cuenta('','','','','','','', 0);
    this.tipoCuentaA=false;
    this.tipoCuentaC=false;
    this.tipoCuentaV=false;
  }
  ngOnInit(): void {
    this.obtenerCuentas();
  }
  async obtenerCuentas(){
    await this._cuentaService.obtenerDatos().subscribe(
      response=>{
        this.cuentas=response.cuentas;
        this.cuentaCorriente=this.cuentas[0];
        if(this.cuentas[0]!=null)
          this.tipoCuentaA = true;
        this.cuentaAhorro=this.cuentas[1];
        if(this.cuentas[1]!=null)
          this.tipoCuentaC = true;
        this.cuentaVinculada=this.cuentas[2];
        if(this.cuentas[2]!=null)
          this.tipoCuentaV = true;
        this.cliente=response.cliente;

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
