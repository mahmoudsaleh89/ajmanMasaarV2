import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {LocationsProvider} from "../../providers/locations/locations";
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";


declare var google;

@IonicPage()
@Component({
  selector: 'page-route',
  templateUrl: 'route.html',
})
export class RoutePage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanelx') directionsPanel: ElementRef;
  map: any;
  directionsService: any;
  directionsDisplay: any;
  startPosition: any;
  endPosition: any;
  suggestedRoute = [];
  clickedRoute = [];
  step: any;
  theSteps = [];
  firstRoute = [];
  allResponse: any;
  old_routes = [];
  respnse: any;
  open: boolean = false;
  iconUse: string = "ios-arrow-down";
  fare: string;
  classAded: string = 'normal';
  label = 'show map';
  hide: boolean = false;
  PlzWait:string ="Please wait...";


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public locations: LocationsProvider,
              public settings: GeneralSettingsProvider) {
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
  }

  ngOnInit() {
    this.startPosition = this.navParams.get('orgin');
    this.endPosition = this.navParams.get('dist');
  }

  ionViewDidEnter() {
    this.loadMap(25.405217, 55.513643);
    this.startNavigating(this.endPosition, this.startPosition);
  }

  ionViewDidLoad() {


  }

  startNavigating(start, end) {
    let loading = this.loadingCtrl.create({
      content: this.PlzWait
    });
    loading.present();

    this.directionsDisplay.setMap(this.map);
    /*this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);*/
    this.directionsService.route({
      origin: start,
      destination: end,
      provideRouteAlternatives: true,
      travelMode: google.maps.TravelMode['TRANSIT'],

    }, (res, status) => {

      loading.dismiss();
      if (status == google.maps.DirectionsStatus.OK) {

        this.allResponse = res;
        for (let i = 0; i < res.routes.length; i++) {
          let currentDate: any = new Date();
          let departure_time = res.routes[i].legs[0].departure_time.value;
          let min: any = Math.ceil((Date.parse(departure_time) - currentDate) / 1000 / 60);

          res.routes[i].legs[0].departure_on = min;
          if (this.allResponse.routes[i].fare) {
            res.routes[i].legs[0].the_fare = this.allResponse.routes[i].fare.text;
          } else {
            res.routes[i].legs[0].the_fare = 'unknown';
          }

          this.suggestedRoute.push(res.routes[i].legs);
          if (i == 0) {
            this.firstRoute = [];
            this.firstRoute.push(res.routes[i].legs);
          }
        }
        this.onSelectRoute(0);
        /* this.directionsDisplay.setDirections(res);*/
      } else {
        console.warn(status);
      }
    });

  }


  loadMap(lat, long) {
    let latLng = new google.maps.LatLng(lat, long);
    let mapOptions = {
      center: latLng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  onSelectRoute(i) {

    let x = this.suggestedRoute[i];
    this.clickedRoute = [];
    this.clickedRoute.push(x);
    this.prepareObject(this.clickedRoute);
    this.drowRoute(i);
  }

  prepareObject(legs) {
    this.theSteps = [];
    let theleg = legs[0][0];
    this.step = {
      name: '',
      time: '',
      type: '',
      busName: '',
      transittype: '',
      instructions: '',
      duration: '',
      distance: '',
      numOfStops: 0
    }
    for (let s = 0; s < theleg.steps.length; s++) {
      this.step = {
        name: '',
        time: '',
        type: '',
        busName: '',
        transittype: '',
        instructions: '',
        duration: '',
        numOfStops: 0,
        distance: ''
      }
      this.step.type = theleg.steps[s].travel_mode;
      this.step.instructions = theleg.steps[s].instructions;
      this.step.duration = theleg.steps[s].duration.text;


      if (s == 0) {

        if (theleg.steps[0].travel_mode == 'WALKING') {
          this.step.name = theleg.start_address;
          this.step.time = theleg.departure_time.text;
          this.step.busName = '';
          /* this.step.numOfStops = theleg.distance.value;*/
          this.step.distance = theleg.steps[s].distance.text;
          this.step.transittype = '';
        }
        else {

          this.step.name = theleg.steps[s].transit.departure_stop.name;
          this.step.time = theleg.steps[s].transit.departure_time.text;
          this.step.busName = theleg.steps[s].transit.line.short_name;
          this.step.numOfStops = theleg.steps[s].transit.num_stops;
          this.step.transittype = theleg.steps[s].transit.line.vehicle.type;
        }
      }
      else {
        if (theleg.steps[s].travel_mode == 'WALKING') {
          this.step.name = theleg.steps[s - 1].transit.arrival_stop.name;
          this.step.time = theleg.steps[s - 1].transit.arrival_time.text;
          this.step.busName = '';
          /*this.step.numOfStops = theleg.distance.value;*/
          this.step.distance = theleg.steps[s].distance.text;
          this.step.transittype = '';
        }
        else {

          this.step.name = theleg.steps[s].transit.departure_stop.name;
          this.step.time = theleg.steps[s].transit.departure_time.text;
          this.step.busName = theleg.steps[s].transit.line.short_name;
          this.step.numOfStops = theleg.steps[s].transit.num_stops;
          this.step.transittype = theleg.steps[s].transit.line.vehicle.type;
        }

      }

      this.theSteps.push(this.step);

    }
  }

  drowRoute(i) {

    this.respnse = this.allResponse;

    this.old_routes = this.respnse.routes;
    try {
      this.fare = this.allResponse.routes[i].fare.text;
    }
    catch (e) {
      this.fare = 'Unknown'
    }
    let selectedroute = this.respnse.routes[i];
    this.respnse.routes = [];
    this.respnse.routes.push(selectedroute);
    this.directionsDisplay.setDirections(this.respnse);
    this.respnse.routes = [];
    for (let i = 0; i < this.old_routes.length; i++) {
      this.respnse.routes.push(this.old_routes[i]);
    }
    this.old_routes = [];
    /*this.toggleArea();*/
  }


  toggleArea() {
    if (this.open) {
      this.open = false;
      this.iconUse = "ios-arrow-down";

      /* this.activeAnimation = "slideInDown";*/
    } else {
      this.open = true;
      this.iconUse = "ios-arrow-up";
      /*this.activeAnimation = "slideInUp";*/
    }
  }

  onShowMap() {
    if (this.classAded == 'normal') {
      this.classAded = 'full';
      this.hide = true;
      this.label = 'hide map';
      this.drowRoute(0);
    } else {
      this.classAded = 'normal'
      this.hide = false;
      this.label = 'show map';
      this.drowRoute(0);
    }
  }

  OnGoToWallet() {
    if(this.settings.isLoggedIn){
      this.navCtrl.push('MyWalletPage');
    }else{
      this.navCtrl.push('TopupMasaarCardPage')
    }

  }





}
