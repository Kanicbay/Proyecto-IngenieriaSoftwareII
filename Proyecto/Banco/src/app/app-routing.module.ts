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
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {path:'inicio',component:InicioComponent},
  {path:'contacto',component:ContactoComponent},
  {path:'nosotros',component:NosotrosComponent},
  {path:'servicios',component:ServiciosComponent},
  {path:'cuenta',component:CuentaComponent},
  {path:'login',component:LoginComponent},
  {path:'credenciales/:idCodigo',component:CredencialesComponent},
  {path:'transferenciasA',component:TransferenciaComponent, canActivate:[AuthGuard]},
  {path:'transferenciasC',component:TransferenciaComponent, canActivate:[AuthGuard]},
  {path:'transferenciasV',component:TransferenciaComponent, canActivate:[AuthGuard]},
  {path:'tipo-transferencia',component:TipoTransferenciaComponent, canActivate:[AuthGuard]},
  {path:'pago-tarjetas',component:PagoTarjetasComponent, canActivate:[AuthGuard]},
  {path:'mi-cuenta',component:MiCuentaComponent, canActivate:[AuthGuard]},
  {path:'detalle-cuenta',component:DetalleCuentaComponent, canActivate:[AuthGuard]},
  {path:'mi-perfil',component:MiPerfilComponent, canActivate:[AuthGuard]},
  {path:'**',component:InicioComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
