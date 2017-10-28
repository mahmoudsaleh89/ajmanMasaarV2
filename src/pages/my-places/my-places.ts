import {Component} from '@angular/core';
import {AlertController, IonicPage, ItemSliding, NavController, NavParams, Platform} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {LocationsProvider} from "../../providers/locations/locations";
import {Geolocation} from '@ionic-native/geolocation';
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-my-places',
  templateUrl: 'my-places.html',
})
export class MyPlacesPage {
  setTab: string = "favorite";
  favLocation: any;
  /*translate issue*/
  RemoveFav: string;
  SureQus: string;
  Cancel: string;
  OK: string;
  RemoveHis: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public settings: GeneralSettingsProvider,
              public locations: LocationsProvider,
              public geolocation: Geolocation,
              public alertCtrl: AlertController,
              public translate: TranslateService,
              public platform: Platform,
              public storage: Storage) {
    this.setLangAndDirction();
    this.locations.loadTrips();
    this.locations.getToFavorits();
  }

  ionViewDidLoad() {
    console.log(this.favLocation);
    this.locations.load(this.locations.mycurrentLocation.coords.latitude, this.locations.mycurrentLocation.coords.longitude);
  }

  ionViewWillEnter() {
    this.favLocation = this.locations.favoritsLocation;
  }

  backToHome() {
    this.navCtrl.setRoot('HomePage');
  }

  removeFromFav(location, slideItem: ItemSliding) {
    debugger;
    this.alertCtrl.create({
      title: this.RemoveFav,
      message: this.SureQus,
      buttons: [
        {
          text: this.Cancel,
          handler: () => {
            slideItem.close();
          }
        },
        {
          text: this.OK,
          handler: () => {
            this.locations.removeFromFavorits(location);
            this.locations.getToFavorits();
            this.favLocation = this.locations.favoritsLocation;
          }
        }
      ]
    }).present();
  }

  removeFromHis(location, slideItem: ItemSliding) {
    debugger;
    this.alertCtrl.create({
      title: this.RemoveHis,
      message: this.SureQus,
      buttons: [
        {
          text: this.Cancel,
          handler: () => {
            slideItem.close();
          }
        },
        {
          text: this.OK,
          handler: () => {
            this.locations.removeFromHistory(location);
            this.locations.loadTrips();
            /*this.favLocation = this.locations.favoritsLocation;*/
          }
        }
      ]
    }).present();
  }

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      debugger;
      if (result == 'ar') {
        this.RemoveFav= "حذف من المفضلة" ;
        this.SureQus = "هل أنت متأكد ؟";
        this.Cancel ="الغاء";
        this.OK="نعم";
        this.RemoveHis="";
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.settings.side = 'right';
      } else if (result == 'en') {
        this.RemoveFav= "Remove Favorite" ;
        this.SureQus = "Are you sure?";
        this.Cancel ="Cancel";
        this.OK="Ok";
        this.RemoveHis="Remove History";
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }
      else {
        this.RemoveFav= "Remove Favorite" ;
        this.SureQus = "Are you sure?";
        this.Cancel ="Cancel";
        this.OK="Ok";
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }
    });
  }

}
