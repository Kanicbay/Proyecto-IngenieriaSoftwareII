import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CredencialesComponent } from './credenciales/credenciales.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { InicioComponent } from './inicio/inicio.component';
import { TransferenciaComponent } from './transferencia/transferencia.component';

const routes: Routes = [
  {path:'inicio',component:CuentaComponent},
  {path:'cuenta',component:CuentaComponent},
  {path:'credenciales',component:CredencialesComponent},
  {path:'transferencias',component:TransferenciaComponent},
  {path:'**',component:InicioComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
