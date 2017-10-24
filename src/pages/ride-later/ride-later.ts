import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {Geolocation} from '@ionic-native/geolocation';
import {DatePicker} from "@ionic-native/date-picker";

declare var google;

@IonicPage()
@Component({
  selector: 'page-ride-later',
  templateUrl: 'ride-later.html',
})
export class RideLaterPage {
  @ViewChild('mapRideLater') mapElement: ElementRef;
  map: any;
  currentTime: any;
  selectedTime: any;
  addressFrom: any;
  addressTo: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public settings: GeneralSettingsProvider,
              private datePicker: DatePicker,
              public geolocation: Geolocation,
              public toastCtrl: ToastController) {
    this.addressFrom = {
      place: this.navParams.get('orgin'),
      subLocality: '',
      lat: 25.405217,
      long: 55.513643
    };
    this.addressTo = {
      place: this.navParams.get('dist'),
      subLocality: '',
      lat: '',
      long: ''
    }
  }

  ionViewDidLoad() {
    let d = new Date();
    d.getHours();
    d.getMinutes();
    this.currentTime = d.getHours().toString() + ':' + d.getMinutes().toString();
    this.addMap(25.405217, 55.513643);

  }

  ionViewDidEnter() {
    this.geolocation.getCurrentPosition(

    ).then(
      (position) => {
        this.addMap(position.coords.latitude, position.coords.longitude);
      })
      .catch(error => {
        this.addMap(25.405217, 55.513643);
      })
  }


  openTimePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'time',
      is24Hour: false,
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      allowOldDates: false,
      todayText: ''
    }).then(
      date => {
        this.selectedTime = date;
        let tempSelectedTime = this.selectedTime;

        this.currentTime = tempSelectedTime.getHours().toString() + ':' + tempSelectedTime.getMinutes().toString();
        /*this.currentTime = this.selectedTime*/
      },
      err => {
        let toast = this.toastCtrl.create({
          message: 'please select time',
          duration: 3000,
          position: 'middle'
        }).present();
      }
    );
  }

  onSetSchedule() {
    if (this.selectedTime) {
      this.navCtrl.push('RoutePage', {'orgin': this.addressTo.place, 'dist': this.addressFrom.place});
    } else {
      return;
    }
  }


  addMap(lat, long) {

    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.addMarker(lat, long);
  }


  addMarker(lat, long) {

    let marker = new google.maps.Marker({
      map: this.map,
      icon: 'img/pin.png',
      animation: google.maps.Animation.DROP,
      draggable: false,
      position: this.map.getCenter()
    });
    let content = "<p>Me !</p>";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', (pos) => {
      infoWindow.open(this.map, marker);
    });

  }

}
