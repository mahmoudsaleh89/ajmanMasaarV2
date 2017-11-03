import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, ModalController, NavController, Platform,
  ToastController
} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {LocationsProvider} from "../../providers/locations/locations";

import {Storage} from '@ionic/storage';
import {Geolocation} from '@ionic-native/geolocation';
import {NativeGeocoder, NativeGeocoderForwardResult, NativeGeocoderReverseResult} from "@ionic-native/native-geocoder";
import {TranslateService} from '@ngx-translate/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';

declare var google;
declare var networkinterface: any;

@IonicPage({
  name: 'HomePage'
})


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit {
  @ViewChild('mapHome') mapElement: ElementRef;
  map: any;
  modal: any;
  addressFrom: any;
  addressTo: any;
  places: any;
  placesPage: any;
  busStationPage: any;
  mylocation: any;
  drwo: false;
  myDate: string;
  markers = [];
  marker: any;
  showBus = false;
  loading: any;
  /*translate issue*/
  PleaseWait: string;
  Warning: string;
  NoInternetAccess: string;
  OK: string;
  OrginLocation: string;
  DestnitionLocation: string;
  DifferentPlaces: string;

  constructor(public navCtrl: NavController,
              public settings: GeneralSettingsProvider,
              public locations: LocationsProvider,
              public modalCtrl: ModalController,
              public storage: Storage,
              public geolocation: Geolocation,
              private nativeGeocoder: NativeGeocoder,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public alertCtr: AlertController,
              public translate: TranslateService,
              public platform: Platform) {
    this.setLangAndDirction();
    this.addressFrom = {
      place: '',
      subLocality: '',
      lat: 25.405217,
      long: 55.513643
    };
    this.addressTo = {
      place: '',
      subLocality: '',
      lat: '',
      long: ''
    };
    this.myDate = new Date().toISOString();


  }

  ngOnInit() {
  }


  ionViewDidLoad() {

    /* this.addMap(25.405217, 55.513643, this.locations.staticData, false);*/
  }

  ionViewDidEnter() {
    this.onStartHomePage();
  }

  onStartHomePage() {
    let loading = this.loadingCtrl.create({
      content: this.PleaseWait
    })
    loading.present();
    this.busStationPage = 'BusStationsPage';
    this.placesPage = 'MyPlacesPage';
    this.geolocation.getCurrentPosition(
    ).then(
      (position) => {
        if (position) {
          this.locations.mycurrentLocation = position;
          this.locations.load(position.coords.latitude, position.coords.longitude);
          this.addMap(position.coords.latitude, position.coords.longitude, this.locations.staticData, true);
          this.setMarkerArray(this.locations.staticData);
          loading.dismiss();
          this.nativeGeocoder.reverseGeocode(position.coords.latitude, position.coords.longitude)
            .then(
              (result: NativeGeocoderReverseResult) =>
                /* this.addressFrom.place=result.administrativeArea*/
                this.addressFrom = {
                  place: result.thoroughfare,
                  subLocality: result.subLocality,
                  lat: position.coords.latitude,
                  long: position.coords.longitude
                }
            )
        } else {
          loading.dismiss();
          this.alertCtr.create({
            title: this.Warning,
            subTitle: this.NoInternetAccess,
            buttons: [this.OK]
          }).present();
        }

      }).catch(error => {

      /*this.locations.load(25.405217, 55.513643);
      this.addMap(25.405217, 55.513643, this.locations.staticData, true);
      this.setMarkerArray(this.locations.staticData);
      this.settings.closeloading();
      this.nativeGeocoder.reverseGeocode(25.405217, 55.513643)
        .then(
          (result: NativeGeocoderReverseResult) => console.log(JSON.stringify(result))
        )*/
    });

  }

  addMap(lat, long, nearby, drwo) {

    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.addMarker(lat, long, drwo);
    this.setMarkerArray(nearby);
    /* this.loading.dismissAll();*/
  }

  setMarkerArray(nearby) {
    for (var i = 0; i < 5; i++) {
      this.onAddMarkers(nearby[i]);
    }
  }

  addMarker(lat, long, drwo) {
    if (drwo) {
      let marker = new google.maps.Marker({
        map: this.map,
        icon: 'img/pin.png',
        animation: google.maps.Animation.DROP,
        draggable: true,
        position: this.map.getCenter()
      });
      let content = "<p>This is your current position !</p>";
      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
      google.maps.event.addListener(marker, 'dragend', (pos) => {

      });
      google.maps.event.addListener(marker, 'click', (pos) => {
        infoWindow.open(this.map, marker);
      });
    }


  }

  onAddMarkers(position) {

    this.markers = [];
    this.marker = new google.maps.Marker({
      position: {lat: position.Latitude, lng: position.Longitude},
      map: this.map,
      icon: 'img/station.png',
      customInfo: position.Id,
      animation: google.maps.Animation.DROP,
      visible: this.showBus
    });


    /*this.markers = [];
    this.marker = new google.maps.Marker({
      position: {lat: position.Latitude, lng: position.Longitude},
      map: this.map,
      icon: 'img/station.png',
      customInfo: position.Id,
      animation: google.maps.Animation.DROP,
      visible: false
    });*/
    this.marker.addListener('click', () => {
      this.onGoToBusScheduler(position.Id, position.LocationName);
    });

    this.markers.push(this.marker);


  }

  onAddPlace(dist) {
    this.modal = this.modalCtrl.create('SearchPlacePage', {'lat': this.addressFrom.lat, 'long': this.addressFrom.long});
    if (dist == 'from') {
      this.modal.onDidDismiss(data => {
        if (data == 'your Location') {
          //call current location
        } else {
          debugger;
          this.addressFrom.place = data;
        }
      });
    }
    else if (dist == 'to') {
      this.modal.onDidDismiss(data => {
        if (data == 'your Location') {
          //alert you can't
        } else {
          debugger;
          this.addressTo.place = data;
        }
      });
    }

    this.modal.present();
  }

  onRideNow() {
    if (!this.addressFrom.place) {
      this.toastCtrl.create(
        {
          message: this.OrginLocation,
          duration: 3000,
          position: 'middle'
        }
      ).present();
      return;
    } else if (!this.addressTo.place) {
      this.toastCtrl.create(
        {
          message: this.DestnitionLocation,
          duration: 3000,
          position: 'middle'
        }
      ).present();
      return;
    } else {

      if (this.addressFrom.place == this.addressTo.place) {

        this.toastCtrl.create(
          {
            message: this.DifferentPlaces,
            duration: 3000,
            position: 'middle'
          }
        ).present();
      } else {
        this.onAddedHistory(this.addressFrom.place, this.addressTo.place, 'RoutePage');
        /*this.navCtrl.push('RoutePage', {'orgin': this.addressTo.place, 'dist': this.addressFrom.place});*/
      }
    }
  }

  onRideLater() {

    if (!this.addressFrom.place) {
      this.toastCtrl.create(
        {
          message: this.OrginLocation,
          duration: 3000,
          position: 'middle'
        }
      ).present();
      return;
    } else if (!this.addressTo.place) {
      this.toastCtrl.create(
        {
          message: this.DestnitionLocation,
          duration: 3000,
          position: 'middle'
        }
      ).present();
      return;
    } else {

      if (this.addressFrom.place == this.addressTo.place) {

        this.toastCtrl.create(
          {
            message: this.DifferentPlaces,
            duration: 3000,
            position: 'middle'
          }
        ).present();
      } else {
        this.onAddedHistory(this.addressFrom.place, this.addressTo.place, 'RideLaterPage');

      }
    }
  }

  onGoToBusScheduler(id, name) {
    this.navCtrl.push('BusSchedulerPage', {'id': id, 'name': name});
  }

  onClickFabs(page) {
    this.navCtrl.push(page);
  }

  onAddedHistory(from, to, GoTo) {
    debugger;
    let trip = {
      to: to,
      from: from,
    }
    this.storage.get('trips').then((res) => {
      if (res) {
        this.locations.trips = res;
        debugger;
        if (this.locations.trips.length != 0) {
          for (let i = 0; i < this.locations.trips.length; i++) {
            debugger;
            if (this.locations.trips[i].from.indexOf(from) == -1) {
              debugger;
              this.locations.trips.push(trip);
            }
            else {
              debugger;

              this.storage.set('trips', this.locations.trips);
            }
            /*this.locations.trips = [];*/
            this.storage.set('trips', this.locations.trips);
          }
          this.navCtrl.push(GoTo, {'orgin': this.addressTo.place, 'dist': this.addressFrom.place});
        } else {
          this.locations.trips = [];
          this.locations.trips.push(trip);
          this.storage.set('trips', this.locations.trips);
          this.navCtrl.push(GoTo, {'orgin': this.addressTo.place, 'dist': this.addressFrom.place});
        }
      }
      else {
        debugger;
        this.locations.trips = [];
        this.locations.trips.push(trip);
        this.storage.set('trips', this.locations.trips);
        this.navCtrl.push(GoTo, {'orgin': this.addressTo.place, 'dist': this.addressFrom.place});
      }
    })

  }

  ToggelMarker() {
    if (this.showBus) {
      this.showBus = false;
    } else {
      this.showBus = true;
    }
    this.markers = [];
    this.setMarkerArray(this.locations.staticData);

  }

  onGotologin() {
    this.navCtrl.setRoot('LoginPage');
  }

  onAddtoFavorite(selectedlocation) {
    debugger;
    this.locations.addToFavorits(selectedlocation);
  }

  onGetLocation() {
    this.onStartHomePage();
  }

  setLangAndDirction() {
    this.storage.get('tc').then((tcr) => {
      if (tcr) {
        this.settings.themeColor = tcr;
      }
    });
    this.storage.get('lang').then((result) => {
      debugger;
      if (result == 'ar') {
        this.PleaseWait = 'يرجى الانتظار'
        this.Warning = 'تحذير';
        this.NoInternetAccess = " تأكد من اتصالك بالانترنت و تغيل خدمة المواقع";
        this.OK = "موافق";
        this.OrginLocation = "يرجى اختيار نقطة الانطلاق";
        this.DestnitionLocation = " يرجى اختيار نقطة الوصول";
        this.DifferentPlaces = "الرجاء اختيار موقعين مختلفين";

        /* OK: string;
         OrginLocation: string;
         DestnitionLocation: string;
         DifferentPlaces: string;
         */
        this.storage.set('lang', 'ar');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.settings.side = 'right';
      }
      else if (result == 'en') {
        this.PleaseWait = 'Please Wait';
        this.Warning = 'Warning';
        this.NoInternetAccess = "please enable gps and make sure you have internet access";
        this.OK = "Ok";
        this.OrginLocation = "please select your origin place";
        this.DestnitionLocation = "please select your destination";
        this.DifferentPlaces = "please select different places";
        this.storage.set('lang', 'en');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }
      else if (result == 'ur') {
        this.PleaseWait = 'برائے مہربانی انتظار کریں';
        this.Warning = 'انتباہ';
        this.NoInternetAccess = "براہ کرم جی پی ایس کو فعال کریں اور اس بات کو یقینی بنائیں کہ آپ انٹرنیٹ تک رسائی حاصل کریں";
        this.OK = "ٹھیک ہے";
        this.OrginLocation = "براہ کرم اپنی اصل جگہ کا انتخاب کریں";
        this.DestnitionLocation = "براہ مہربانی اپنی منزل منتخب کریں";
        this.DifferentPlaces = "براہ مہربانی مختلف مقامات کو منتخب کریں";
        this.storage.set('lang', 'ur');
        this.translate.setDefaultLang('ur');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ur', true);
        this.settings.side = 'right';
      }
      else {
        this.PleaseWait = 'Please Wait';
        this.Warning = 'Warning';
        this.NoInternetAccess = "please enable gps and make sure you have internet access";
        this.OK = "Ok";
        this.OrginLocation = "please select you origin place";
        this.DestnitionLocation = "please select you destination";
        this.DifferentPlaces = "please select different places";
        this.storage.set('lang', 'en');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }


    });
  }
}
