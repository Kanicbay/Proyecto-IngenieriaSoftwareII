import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { CredencialesComponent } from './credenciales/credenciales.component';
import { TransferenciaComponent } from './transferencia/transferencia.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { MiCuentaComponent } from './mi-cuenta/mi-cuenta.component';
import { PagoTarjetasComponent } from './pago-tarjetas/pago-tarjetas.component';
import { ContactoComponent } from './contacto/contacto.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { LoginComponent } from './login/login.component';
import { DetalleCuentaComponent } from './detalle-cuenta/detalle-cuenta.component';
import { TipoTransferenciaComponent } from './tipo-transferencia/tipo-transferencia.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { LoginRegistroComponent } from './login-registro/login-registro.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    CredencialesComponent,
    TransferenciaComponent,
    CuentaComponent,
    MiPerfilComponent,
    MiCuentaComponent,
    PagoTarjetasComponent,
    ContactoComponent,
    NosotrosComponent,
    LoginComponent,
    DetalleCuentaComponent,
    TipoTransferenciaComponent,
    ServiciosComponent,
    LoginRegistroComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
