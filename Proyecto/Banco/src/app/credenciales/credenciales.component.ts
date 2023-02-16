import { Component } from '@angular/core';
import { CargarScriptsService } from '../cargar-scripts.service';

@Component({
  selector: 'app-credenciales',
  templateUrl: './credenciales.component.html',
  styleUrls: ['./credenciales.component.css']
})
export class CredencialesComponent {
  constructor(private _CargaScritps:CargarScriptsService){
    _CargaScritps.Cargar(["CrearCredenciales"]);
  }
}
