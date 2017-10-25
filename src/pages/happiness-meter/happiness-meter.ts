import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {NgForm} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-happiness-meter',
  templateUrl: 'happiness-meter.html',
})

export class HappinessMeterPage {
  sad: boolean;
  normal: boolean;
  happy: boolean;
  veryhappy: boolean;
  rateValue: any;
  desc: string;
  progress: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public settings: GeneralSettingsProvider,
              public tstCTR: ToastController,
              public storage: Storage,
              public translate: TranslateService,
              public platform: Platform) {
    this.setLangAndDirction();
  }

  ionViewDidLoad() {

  }

  setRate(rate) {
    this.rateValue = rate;

    switch (rate) {
      case '1':
        this.sad = true;
        this.normal = false;
        this.happy = false;
        this.veryhappy = false;

        break;
      case '2':
        this.sad = false;
        this.normal = true;
        this.happy = false;
        this.veryhappy = false;
        break;
      case '3':
        this.sad = false;
        this.normal = false;
        this.happy = true;
        this.veryhappy = false;
        break;
      case '4':
        this.sad = false;
        this.normal = false;
        this.happy = false;
        this.veryhappy = true;
        break;
      default:
        this.sad = false;
        this.normal = false;
        this.happy = false;
        this.veryhappy = false;
    }
  }

  onSubmitRate() {
    this.progress = true;
    debugger;
    console.log(this.rateValue, this.desc);
    this.settings.onSendRate(this.rateValue, this.desc).then((res) => {
      this.progress = false;
      if (res) {
        this.tstCTR.create({
          message: 'Thanks for your review',
          duration: 3000
        }).present();
        this.navCtrl.popTo('HomePage');
      }
    });
  }

  onCloseModal() {
    this.navCtrl.pop();
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
