import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {StationSchedulerProvider} from "../../providers/station-scheduler/station-scheduler";
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";

@IonicPage()
@Component({
  selector: 'page-bus-scheduler',
  templateUrl: 'bus-scheduler.html',
})
export class BusSchedulerPage {
  name:string;
  id:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public stations:StationSchedulerProvider,
              public settings: GeneralSettingsProvider)
  {
    this.name = this.navParams.get('name');
    this.id=this.navParams.get('id');
  }

  ionViewDidLoad() {
    this.stations.load(this.id);
  }
}
