import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactoComponent } from './contacto/contacto.component';
import { CredencialesComponent } from './credenciales/credenciales.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { InicioComponent } from './inicio/inicio.component';
import { MiCuentaComponent } from './mi-cuenta/mi-cuenta.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { PagoTarjetasComponent } from './pago-tarjetas/pago-tarjetas.component';
import { TransferenciaComponent } from './transferencia/transferencia.component';

const routes: Routes = [
  {path:'inicio',component:InicioComponent},
  {path:'contacto',component:ContactoComponent},
  {path:'nosotros',component:NosotrosComponent},
  {path:'cuenta',component:CuentaComponent},
  {path:'credenciales',component:CredencialesComponent},
  {path:'transferencias',component:TransferenciaComponent},
  {path:'pago-tarjetas',component:PagoTarjetasComponent},
  {path:'mi-cuenta',component:MiCuentaComponent},
  {path:'mi-perfil',component:MiPerfilComponent},
  {path:'**',component:InicioComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
