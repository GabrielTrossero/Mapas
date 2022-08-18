import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapaLibreriaComponent } from './mapa-libreria/mapa-libreria.component';
import { MapaNativoComponent } from './mapa-nativo/mapa-nativo.component';

const routes: Routes = [
  { path: 'nativo', component: MapaNativoComponent },
  { path: 'libreria', component: MapaLibreriaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
