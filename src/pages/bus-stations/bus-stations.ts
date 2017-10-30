import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {LocationsProvider} from "../../providers/locations/locations";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage'

@IonicPage()
@Component({
  selector: 'page-bus-stations',
  templateUrl: 'bus-stations.html',
})
export class BusStationsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public settings:GeneralSettingsProvider,
              public locations: LocationsProvider,
              public  translate: TranslateService,
              private platform: Platform,
              public storage: Storage) {
    this.setLangAndDirction();
  }

  ionViewDidLoad() {

  }
  onGoToBusScheduler(id,name) {
    debugger;
    this.navCtrl.push('BusSchedulerPage',{'id':id,'name':name});

  }
  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      debugger;
      if (result == 'ar') {

        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.settings.side = 'right';
      } else if (result == 'en') {

        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }else if (result == 'ur') {
        this.storage.set('lang', 'ur');
        this.translate.setDefaultLang('ur');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ur', true);
        this.settings.side = 'right';
      }
      else {

        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }

    });
  }
}
