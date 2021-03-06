import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {Geolocation} from '@ionic-native/geolocation';
import {DatePicker} from "@ionic-native/date-picker";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';

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
  SIT_TIME_WARNING: string;
  IOS_BACK: string;
  @ViewChild(Navbar) navbar: Navbar;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public settings: GeneralSettingsProvider,
              private datePicker: DatePicker,
              public geolocation: Geolocation,
              public toastCtrl: ToastController,
              public translate: TranslateService,
              public platform: Platform,
              public storage: Storage) {
    this.setLangAndDirction();
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
          message: this.SIT_TIME_WARNING,
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
      this.toastCtrl.create({
        message: this.SIT_TIME_WARNING,
        duration: 3000
      }).present();
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

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      debugger;
      if (result == 'ar') {
        this.IOS_BACK = "عودة";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
        this.SIT_TIME_WARNING="الرجاء احديد الوقت !";
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.settings.side = 'right';
      } else if (result == 'en') {
        this.IOS_BACK = "Back";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
        this.SIT_TIME_WARNING="Please sit your time !";
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      } else if (result == 'ur') {
        this.IOS_BACK = "پیچھے";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
        this.SIT_TIME_WARNING="اپنا وقت بیٹھو !";
        this.storage.set('lang', 'ur');
        this.translate.setDefaultLang('ur');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ur', true);
        this.settings.side = 'right';
      }
      else {
        this.IOS_BACK = "Back";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
        this.SIT_TIME_WARNING="Please sit your time !";
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }
    });
  }

}
