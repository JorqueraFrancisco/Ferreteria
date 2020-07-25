import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistroComponent } from './pages/administrativo/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { MetasComponent } from './pages/vendedor/metas/metas.component';
import { HomeAdminComponent } from './pages/administrativo/home-admin/home-admin.component';
import { IngresarDatosComponent } from './pages/administrativo/ingresar-datos/ingresar-datos.component';
import { ReportesComponent } from './pages/administrativo/reportes/reportes.component';
import { IngresarMetasComponent } from './pages/administrativo/ingresar-metas/ingresar-metas.component';
import { UsuariosAdminComponent } from './pages/administrativo/usuarios-admin/usuarios-admin.component';


const routes: Routes = [
  { path: 'metas'    , component: MetasComponent, canActivate: [ AuthGuard ]},
  { path: 'homeAdmin'    , component: HomeAdminComponent, canActivate: [ AuthGuard ]},
  { path: 'ingresarDatos'    , component: IngresarDatosComponent, canActivate: [ AuthGuard ]},
  { path: 'ingresarMetas/:id'    , component: IngresarMetasComponent, canActivate: [ AuthGuard ]},
  { path: 'reportes'    , component: ReportesComponent, canActivate: [ AuthGuard ]},
  { path: 'registro', component: RegistroComponent },
  { path: 'usuariosAdmin', component: UsuariosAdminComponent },
  { path: 'login'   , component: LoginComponent },
  { path: '**', redirectTo: 'login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
