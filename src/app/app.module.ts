import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/administrativo/registro/registro.component';
import { environment } from '../environments/environment';
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';


//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { MetasComponent } from './pages/vendedor/metas/metas.component';
import { ReportesComponent } from './pages/administrativo/reportes/reportes.component';
import { IngresarDatosComponent } from './pages/administrativo/ingresar-datos/ingresar-datos.component';
import { IngresarMetasComponent } from './pages/administrativo/ingresar-metas/ingresar-metas.component';
import { HomeAdminComponent } from './pages/administrativo/home-admin/home-admin.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UsuariosAdminComponent } from './pages/administrativo/usuarios-admin/usuarios-admin.component';

//Graficos
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegistroComponent,
    MetasComponent,
    ReportesComponent,
    IngresarDatosComponent,
    IngresarMetasComponent,
    HomeAdminComponent,
    NavbarComponent,
    UsuariosComponent,
    UsuariosAdminComponent,
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule,
    ChartsModule,
    NgxChartsModule,
    BrowserAnimationsModule 
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }