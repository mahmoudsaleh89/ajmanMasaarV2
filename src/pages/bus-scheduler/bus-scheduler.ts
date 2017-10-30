import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {StationSchedulerProvider} from "../../providers/station-scheduler/station-scheduler";
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage'

@IonicPage()
@Component({
  selector: 'page-bus-scheduler',
  templateUrl: 'bus-scheduler.html',
})
export class BusSchedulerPage {
  name: string;
  id: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public stations: StationSchedulerProvider,
              public settings: GeneralSettingsProvider,
              public translate: TranslateService,
              public platform: Platform,
              public storage: Storage) {
    this.setLangAndDirction();
    this.name = this.navParams.get('name');
    this.id = this.navParams.get('id');
  }

  ionViewDidLoad() {
    debugger;
    this.stations.load(this.id);
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
      } else if (result == 'ur') {
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
