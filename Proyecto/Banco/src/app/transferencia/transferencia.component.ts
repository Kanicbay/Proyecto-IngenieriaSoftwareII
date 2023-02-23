import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CargarScriptsService } from '../cargar-scripts.service';
import { Cuenta } from '../models/cuenta';
import { Transferencia } from '../models/transferencia';
import { CargarService } from '../services/cargar.service';
import { Global } from '../services/global';
import { TransferenciaService } from '../services/transferencia.service';

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.css'],
  providers:[TransferenciaService, CargarService]
})
export class TransferenciaComponent implements OnInit {
  public transferencia:Transferencia;
  public cuenta:Cuenta;
  public url:string;
  public idCreado:string;
  constructor(
    private _CargaScritps:CargarScriptsService,
    private _transferenciaService:TransferenciaService,
    private _router:Router,
    ){
    this.url=Global.url;
    this.transferencia=new Transferencia('','','',0);
    this.cuenta=new Cuenta('','','','','','','', 100); //Debe ser el de la base de datos este this.cuenta, estoy creando uno nuevo y no ocupando de la base 
    this.idCreado='';
    this
  }

  getCuenta(){
    this._transferenciaService.obtenerSaldo(this.cuenta).subscribe(
      response=>{
        if(response.cuenta){
          this.cuenta=response.cuenta;
          console.log(this.cuenta);
        }
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

  ngOnInit(): void {
  }
  

}
