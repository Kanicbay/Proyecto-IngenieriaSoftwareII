import { Component } from '@angular/core';
import { CargarScriptsService } from '../cargar-scripts.service';

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.css']
})
export class TransferenciaComponent {
  constructor(private _CargaScritps:CargarScriptsService){
    _CargaScritps.Cargar(["Transferencias"]);
  }
}
