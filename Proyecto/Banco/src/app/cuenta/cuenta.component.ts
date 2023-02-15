import { Component } from '@angular/core';
import { CargarScriptsService } from '../cargar-scripts.service';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent {
  constructor(private _CargaScritps:CargarScriptsService){
    _CargaScritps.Cargar(["CreacionCuenta"]);
  }
}
