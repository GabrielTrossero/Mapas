//para que dentro de este ts reconozca todos los elementos de la librería que vamos a utilizar
/// <reference path="../../../node_modules/@types/googlemaps/index.d.ts"/>

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-mapa-nativo',
  templateUrl: './mapa-nativo.component.html',
  styleUrls: ['./mapa-nativo.component.css']
})
export class MapaNativoComponent implements OnInit {

  @ViewChild('divMap') divMap: ElementRef; //recuperamos el elemento html

  mapa: google.maps.Map; //es un tipo especifico de la libreria de google maps

  constructor() { }

  ngOnInit(): void {

  }

  //lo cargamos acá porque si lo hacemos en ngOnInit nos da error, ya que se ejecuta antes de que pueda cargarse
  ngAfterViewInit(): void {
    //obtenemos posicion actual y se la pasamos a "cargarMapa"
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.cargarMapa(position);
      })
    }
    else {
      console.log('Navegador no disponible');
    }
  }

  cargarMapa(position) {
    const opciones = {
      center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.HYBRID
    }

    this.mapa = new google.maps.Map(this.divMap.nativeElement, opciones);
  }

}
