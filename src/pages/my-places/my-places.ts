import {Component} from '@angular/core';
import {AlertController, IonicPage, ItemSliding, NavController, NavParams} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {LocationsProvider} from "../../providers/locations/locations";
import {Geolocation} from '@ionic-native/geolocation';


@IonicPage()
@Component({
  selector: 'page-my-places',
  templateUrl: 'my-places.html',
})
export class MyPlacesPage {
  setTab: string = "favorite";
  favLocation: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public settings: GeneralSettingsProvider,
              public locations: LocationsProvider,
              public geolocation: Geolocation,
              public alertCtrl: AlertController) {
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
      title: 'Remove Favorite',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            slideItem.close();
          }
        },
        {
          text: 'Ok',
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
      title: 'Remove Favorite',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            slideItem.close();
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.locations.removeFromHistory(location);
            this.locations.loadTrips();
            /*this.favLocation = this.locations.favoritsLocation;*/
          }
        }
      ]
    }).present();
  }

}
