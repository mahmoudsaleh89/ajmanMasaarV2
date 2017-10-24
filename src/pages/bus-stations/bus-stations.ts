import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {LocationsProvider} from "../../providers/locations/locations";

/**
 * Generated class for the BusStationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bus-stations',
  templateUrl: 'bus-stations.html',
})
export class BusStationsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public settings:GeneralSettingsProvider,
              public locations: LocationsProvider) {}

  ionViewDidLoad() {

  }
  onGoToBusScheduler(id,name) {
    this.navCtrl.push('BusSchedulerPage',{'id':id,'name':name});

  }
}
