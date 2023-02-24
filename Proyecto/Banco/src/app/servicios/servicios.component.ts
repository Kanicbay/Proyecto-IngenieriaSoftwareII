import { Component } from '@angular/core';
import { CargarScriptsService } from '../cargar-scripts.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent {
  constructor(private _CargaScritps:CargarScriptsService){
    _CargaScritps.Cargar(["IrArriba"]);
  }
}
