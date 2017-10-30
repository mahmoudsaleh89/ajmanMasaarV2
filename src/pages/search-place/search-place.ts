import {Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {Geolocation, GeolocationOptions, Geoposition} from "@ionic-native/geolocation";
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {LocationsProvider} from "../../providers/locations/locations";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';
import {replaceTemplateUrl} from "@ionic/app-scripts/dist/template";

declare var google;

@IonicPage()
@Component({
  selector: 'page-search-place',
  templateUrl: 'search-place.html',
})
export class SearchPlacePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  nearbyPlaces: any;
  currentLocation: any;
  autocompleteItems;
  autocomplete;
  options: GeolocationOptions;
  currentPos: Geoposition;
  service = new google.maps.places.AutocompleteService();
  favLocation: any;
  arrowDir: boolean;
  tempDataLocation;
  selectedPos = {
    locality: '',
    sublocality: '',
    thoroughfare: '',
    lat: 0,
    long: 0
  }


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public geolocation: Geolocation,
              private zone: NgZone,
              public settings: GeneralSettingsProvider,
              public locations: LocationsProvider,
              public translate: TranslateService,
              public platform: Platform,
              public storage: Storage) {
    this.setLangAndDirction();
    this.locations.loadTrips();
    this.locations.getToFavorits();
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  ionViewDidLoad() {
    this.favLocation = this.locations.favoritsLocation;
    this.onLoadNearByPlaces(this.locations.mycurrentLocation.coords.latitude, this.locations.mycurrentLocation.coords.longitude);
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    debugger;
    this.viewCtrl.dismiss(item);
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({
      input: this.autocomplete.query,
      componentRestrictions: {country: 'AE'}
    }, function (predictions, status) {
      me.autocompleteItems = [];
      me.zone.run(function () {
        if (predictions) {
          predictions.forEach(function (prediction) {
            me.autocompleteItems.push(prediction.description);
          });
        }
      });
    });
  }

  goBack() {
    this.viewCtrl.dismiss();
  }

  onLoadNearByPlaces(lat, long) {

    let currentLocation = new google.maps.LatLng(lat, long);
    let request = {
      location: currentLocation,
      radius: '500',
      type: ['restaurant', 'bus_station', 'car_dealer', 'city_hall', 'bank']
    };
    let servicePlaces = new google.maps.places.PlacesService(this.mapElement.nativeElement);
    servicePlaces.nearbySearch(request, (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        this.nearbyPlaces = results;
      }
    });
  }

  onAddtoFavorite(selectedlocation) {
    let selected = {
      place: selectedlocation
    }
    this.locations.addToFavorits(selected);
  }

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      debugger;
      if (result == 'ar') {
        this.arrowDir = false;
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.settings.side = 'right';
      } else if (result == 'en') {
        this.arrowDir = true;
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      } else if (result == 'ur') {
        this.arrowDir = false;
        this.storage.set('lang', 'ur');
        this.translate.setDefaultLang('ur');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ur', true);
        this.settings.side = 'right';
      }
      else {
        this.arrowDir = true;
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }

    });
  }
}
