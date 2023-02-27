import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CuentaService } from '../services/cuenta.service';
import { CargarService } from '../services/cargar.service';
import { Global } from '../services/global';
import { Cuenta } from '../models/cuenta';
import { Router, ActivatedRoute } from '@angular/router';
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
  public codigoVerificacion:string;
  public isVerified:boolean;
  public idCodigo:string;
  
  constructor(
    private _cuentaService:CuentaService,
    private _cargarService:CargarService,
    private _router:Router,
    private _activatedRouter:ActivatedRoute
  ) { 
    this.url=Global.url;
    this.cuenta=new Cuenta('','','','','','','', 0);
    this.status='';
    this.idCreado='';
    this.cuentaExiste=false;
    this.codigoVerificacion='';
    this.isVerified=false;
    this.idCodigo='';
  }

  ngOnInit(): void {
  }

  async crearCuenta(form:NgForm){
    console.log("Esta es la cuenta: ", this.cuenta.tipoCuenta);
    try {
      console.log("Entre1");
      const codigoCreado = await this._cuentaService.crearCodigoVerificacion(this.cuenta.cedula).toPromise();
      console.log("Entre2");
      const codigoVerificacion = await this.obtenerCodigoVerificacion();
      if(!codigoVerificacion){
        alert("Debes ingresar el código de verificación para continuar con el proceso");
        return;
      }
      const verificacionCodigo = await this.verificarCodigoVerificacion(codigoVerificacion);
      if(!verificacionCodigo){
        alert("El código de verificación no es válido");
        return;
      }
      this.idCodigo = codigoCreado.codigo._id;
      console.log(this.idCodigo);
      await this._cuentaService.crearCuenta(this.cuenta).subscribe(
        response=>{
          console.log("Response",response);
          if(response.message == 'Proceso exitoso'){            
            alert("Cuenta Creada");
            this._router.navigate(['/credenciales', this.idCodigo]);
          }else{
            this.status='failed';
          }
        },
        error=>{
          if(error.status==409){
            this.status='Los datos ingresados corresponde a una cuenta existente';
            this.cuentaExiste=true;
            form.reset();
            timer(3000).subscribe(()=>this.cuentaExiste=false);
          }else{
            console.log(<any>error);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async obtenerCodigoVerificacion(){
    let codigoVerificacion = '';
    while(!codigoVerificacion){
      codigoVerificacion = prompt("Ingrese el código de verificación") || '';
    }
    return codigoVerificacion;
  }

  async verificarCodigoVerificacion(codigo: string){
    try{
      const response = await this._cuentaService.verificarCodigoVerificacion(codigo).toPromise();
      return response.message == "El codigo existe";
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async crearNuevaCuenta(cuenta: Cuenta){
    try{
      const response = await this._cuentaService.crearCuenta(cuenta).toPromise();
      if(response.message == "Proceso exitoso"){
        const result = await this._cargarService.peticionRequest(Global.url+"createAccount/",[],[],'foto');
        if(result){
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

}
