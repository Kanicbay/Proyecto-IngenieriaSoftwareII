import { Component, OnInit } from '@angular/core';
import { CuentaService } from '../services/cuenta.service';
import { CargarService } from '../services/cargar.service';
import { Cuenta } from '../models/cuenta';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.css'],
  providers:[CuentaService, CargarService]
})
export class MiCuentaComponent implements OnInit {
  public cuentas:Cuenta[];
  public cuentaCorriente:Cuenta;
  public cuentaAhorro:Cuenta;
  public cuentaVinculada:Cuenta;

  constructor(
    private _cuentaService:CuentaService,
  ) { 
    this.cuentas=[];
    this.cuentaCorriente=new Cuenta('','','','','','','', 0);
    this.cuentaAhorro=new Cuenta('','','','','','','', 0);
    this.cuentaVinculada=new Cuenta('','','','','','','', 0);
  }

  ngOnInit(): void {
    this.obtenerCuentas();
  }

  async obtenerCuentas(){
    await this._cuentaService.obtenerCuentas().subscribe(
      response=>{
        this.cuentas=response.cuentas;
        this.cuentaCorriente=this.cuentas[0];
        this.cuentaAhorro=this.cuentas[1];
        this.cuentaVinculada=this.cuentas[2];
        console.log(this.cuentas);
      },
      error=>{
        console.log(error);
      }
    );
  }

}
