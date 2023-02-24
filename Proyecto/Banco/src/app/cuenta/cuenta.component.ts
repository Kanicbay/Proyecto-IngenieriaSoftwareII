import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CuentaService } from '../services/cuenta.service';
import { CargarService } from '../services/cargar.service';
import { Global } from '../services/global';
import { Cuenta } from '../models/cuenta';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css'],
  providers:[CuentaService, CargarService]
})
export class CuentaComponent implements OnInit {
  public cuenta:Cuenta;
  public url:string;
  public status:string;
  public idCreado:string;
  public cuentaExiste:boolean;
  
  constructor(
    private _cuentaService:CuentaService,
    private _cargarService:CargarService,
    private _router:Router,
  ) { 
    this.url=Global.url;
    this.cuenta=new Cuenta('','','','','','','', 0);
    this.status='';
    this.idCreado='';
    this.cuentaExiste=false;
  }

  ngOnInit(): void {
  }

  crearCuenta(form:NgForm){
    this._cuentaService.crearCuenta(this.cuenta).subscribe(
      response=>{
        if(response.cuenta){
          this._cargarService.peticionRequest(Global.url+"createAccount/"+response.cuenta._id,[],[],'foto')
          .then((result:any)=>{
            this.status='success';
            this.idCreado=result.cuenta._id;
          });
        }else{
          this.status='failed';
        }
        //Redirigir a la pagina de credenciales
        //  (IMPORTANTE)  -->  Esperar por implementación de código por correo redigir ahí
        alert("Cuenta Creada");
        this._router.navigate(['/credenciales']);
      },
      error=>{
        if(error.status==400){
          this.status='Los datos ingresados corresponde a una cuenta existente';
          this.cuentaExiste=true;
          form.reset();
          timer(3000).subscribe(()=>this.cuentaExiste=false);
        }else{
          console.log(<any>error);
        }
      }
    );
  }

}
