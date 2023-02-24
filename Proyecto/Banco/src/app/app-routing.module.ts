import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactoComponent } from './contacto/contacto.component';
import { CredencialesComponent } from './credenciales/credenciales.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { DetalleCuentaComponent } from './detalle-cuenta/detalle-cuenta.component';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { MiCuentaComponent } from './mi-cuenta/mi-cuenta.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { PagoTarjetasComponent } from './pago-tarjetas/pago-tarjetas.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { TipoTransferenciaComponent } from './tipo-transferencia/tipo-transferencia.component';
import { TransferenciaComponent } from './transferencia/transferencia.component';

const routes: Routes = [
  {path:'inicio',component:InicioComponent},
  {path:'contacto',component:ContactoComponent},
  {path:'nosotros',component:NosotrosComponent},
  {path:'servicios',component:ServiciosComponent},
  {path:'cuenta',component:CuentaComponent},
  {path:'login',component:LoginComponent},
  {path:'credenciales',component:CredencialesComponent},
  {path:'transferencias',component:TransferenciaComponent},
  {path:'tipo-transferencia',component:TipoTransferenciaComponent},
  {path:'pago-tarjetas',component:PagoTarjetasComponent},
  {path:'mi-cuenta',component:MiCuentaComponent},
  {path:'detalle-cuenta',component:DetalleCuentaComponent},
  {path:'mi-perfil',component:MiPerfilComponent},
  {path:'**',component:InicioComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
