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
  marcadores: google.maps.Marker[];

  constructor() {
    this.marcadores = [];
  }

  ngOnInit(): void {

  }

  //lo cargamos acá porque si lo hacemos en ngOnInit nos da error, ya que se ejecuta antes de que pueda cargarse
  ngAfterViewInit(): void {
    //obtenemos posicion actual y se la pasamos a "cargarMapa"
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.cargarMapa(position);
        this.cargarAutocomplete();
      });
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

    const icono = {
      url: 'https://cdn-icons-png.flaticon.com/512/535/535188.png',
      scaledSize: new google.maps.Size(60, 60) //tamaño del ícono
    }

    const marcadorCentral = new google.maps.Marker({
      position: this.mapa.getCenter(), //obtenemos el centro del mapa
      animation: google.maps.Animation.DROP, //animacion en la cual el marcador "cae" cuando cargamos la pag
      icon: icono //ícono personalizado
    });
    marcadorCentral.setMap(this.mapa); //asignarle un mapa al marcador

    google.maps.event.addListener(this.mapa, 'click', (event: google.maps.MouseEvent) => { //evento click sobre el mapa
      const marcadorDinamico = new google.maps.Marker({
        position: event.latLng, //la posicion pulsada se guarda en latLng
        animation: google.maps.Animation.DROP
      });
      marcadorDinamico.setDraggable(true); //para que el marcador se pueda mover
      marcadorDinamico.setMap(this.mapa);
      this.marcadores.push(marcadorDinamico); //guardo el marcador

      google.maps.event.addListener(marcadorDinamico, 'click', event => { //evento click sobre el marcador
        marcadorDinamico.setMap(null); //eliminar marcador
      });

      google.maps.event.addListener(marcadorDinamico, 'mouseover', event => { //evento cuando pasamos sobre el marcador
        marcadorDinamico.setAnimation(google.maps.Animation.BOUNCE);
      });

      google.maps.event.addListener(marcadorDinamico, 'mouseout', event => { //evento cuando salimos del marcador
        marcadorDinamico.setAnimation(null);
      });
    });
  }

  borrarMarcadores() {
    for (let marcador of this.marcadores) {
      marcador.setMap(null);
    }
  }

  //NO FUNCIONA (no se porqué)
  cargarAutocomplete() {
    //inserto el autocomplete en el input
    const autocomplete = new google.maps.places.Autocomplete(
      document.querySelector('#inputPlaces')
    );

    //centro el mapa en el lugar que busco
    google.maps.event.addListener(autocomplete, 'place_changed', event => {
      const place = autocomplete.getPlace();
      console.log(place);

      this.mapa.setCenter(place.geometry.location);

      const marker = new google.maps.Marker({
        position: place.geometry.location
      });
      marker.setMap(this.mapa); //le agrego un marcador al mapa
    });
  }

  calcularRuta() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    directionsRenderer.setMap(this.mapa);

    directionsService.route({
      origin: 'Madrid, españa',
      destination: 'Valencia, españa',
      travelMode: google.maps.TravelMode.DRIVING
    }, result => {
      console.log(result);
      directionsRenderer.setDirections(result);
    });
  }

}
