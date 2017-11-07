import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, Slides} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {Storage} from '@ionic/storage';
import {MyApp} from "../../app/app.component";
import {FCM} from "@ionic-native/fcm";

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
              public translate: TranslateService,
              public myApp: MyApp) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
  }

  onSetLang(language) {
    debugger;
    this.settings.lang = language;
    this.storage.set('firstRun', false);
    if (language == 'ar') {
      this.myApp.WARNING_TEAXT = "تنبيه";
      this.myApp.PLEASE_LOGIN_MSG = "يرجى تسجيل الدخول للاستفادة من هذة الخدمة";
      this.myApp.LOGIN_LABLE = "دخول";
      this.myApp.CANCEL_LABEL = "الغاء";
      this.translate.setDefaultLang('ar');
      this.platform.setDir('rtl', true);
      this.platform.setLang('ar', true);
      this.storage.set('lang', language);

    } else if (language == 'en') {

      this.myApp.WARNING_TEAXT = "Warning";
      this.myApp.PLEASE_LOGIN_MSG = "please login to use this feature !";
      this.myApp.LOGIN_LABLE = "Login";
      this.myApp.CANCEL_LABEL = "Cancel";
      this.translate.setDefaultLang('en');
      this.platform.setDir('ltr', true);
      this.platform.setLang('en', true);
      this.storage.set('lang', language);

    } else if (language == 'ur') {
      this.myApp.WARNING_TEAXT = "انتباہ";
      this.myApp.PLEASE_LOGIN_MSG = "اس خصوصیت کو استعمال کرنے کے لئے لاگ ان کریں";
      this.myApp.LOGIN_LABLE = "لاگ ان";
      this.myApp.CANCEL_LABEL = "منسوخ کریں";
      this.storage.set('lang', 'ur');
      this.translate.setDefaultLang('ur');
      this.platform.setDir('rtl', true);
      this.platform.setLang('ur', true);
      this.settings.side = 'right';
    }
    else {
      this.myApp.WARNING_TEAXT = "Warning";
      this.myApp.PLEASE_LOGIN_MSG = "please login to use this feature !";
      this.myApp.LOGIN_LABLE = "Login";
      this.myApp.CANCEL_LABEL = "Cancel";
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
