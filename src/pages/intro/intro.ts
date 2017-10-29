import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, Slides} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {Storage} from '@ionic/storage';

@IonicPage({
  name: 'IntroPage'
})
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {
  @ViewChild(Slides) slides: Slides;
  hide: boolean;

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

    } else if (language == 'ur') {
      this.storage.set('lang', 'ur');
      this.translate.setDefaultLang('ur');
      this.platform.setDir('rtl', true);
      this.platform.setLang('ur', true);
      this.settings.side = 'right';
    }
    else {
      this.translate.setDefaultLang('en');
      this.platform.setDir('ltr', true);
      this.storage.set('lang', language);
      this.platform.setLang('en', true);

    }
    this.navCtrl.setRoot('HomePage');
  }

  goToSelectLang() {
    this.slides.slideTo(4, 500);
  }

  onGetIndex() {
    let index = this.slides.getActiveIndex();
    if (index > 2) {
      this.hide = true;
    }

  }
}
