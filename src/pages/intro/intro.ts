import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";


@IonicPage({
  name: 'IntroPage'
})
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public platform: Platform,
              public storage: Storage,
              public settings: GeneralSettingsProvider,
              public translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
  }

  onSetLang(language) {
    debugger;
    this.settings.lang = language;
    this.storage.set('firstRun', false);
    if (language == 'ar') {
      this.translate.setDefaultLang('ar');
      this.platform.setDir('rtl', true);
      this.platform.setLang('ar', true);
      this.storage.set('lang', language);


    } else if (language == 'en') {
      this.translate.setDefaultLang('en');
      this.platform.setDir('ltr', true);
      this.platform.setLang('en', true);
      this.storage.set('lang', language);

    } else {
      this.translate.setDefaultLang('en');
      this.platform.setDir('ltr', true);
      this.storage.set('lang', language);
      this.platform.setLang('en', true);

    }
    this.navCtrl.setRoot('HomePage');
  }

}
