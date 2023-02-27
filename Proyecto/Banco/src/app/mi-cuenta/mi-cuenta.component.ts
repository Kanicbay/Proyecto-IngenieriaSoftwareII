import { Component, OnInit } from '@angular/core';
import { CuentaService } from '../services/cuenta.service';
import { CargarService } from '../services/cargar.service';
import { Cuenta } from '../models/cuenta';
import { Cliente } from '../models/cliente';
import { CookieService} from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.css'],
  providers:[CuentaService, CargarService, CookieService]
})
export class MiCuentaComponent implements OnInit {
  public cliente:Cliente;
  public cuentas:Cuenta[];
  public cuentaCorriente:Cuenta;
  public cuentaAhorro:Cuenta;
  public cuentaVinculada:Cuenta;

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
  }

  ngOnInit(): void {
    this.obtenerCuentas();
  }

  async obtenerCuentas(){
    await this._cuentaService.obtenerCuenta().subscribe(
      response=>{
        this.cuentas=response.cuentas;
        this.cuentaCorriente=this.cuentas[0];
        this.cuentaAhorro=this.cuentas[1];
        this.cuentaVinculada=this.cuentas[2];
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
