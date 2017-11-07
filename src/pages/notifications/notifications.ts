import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams, Platform} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  IOS_BACK: string;
  @ViewChild(Navbar) navbar: Navbar;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              public platform: Platform,
              public storage: Storage,
              public settings: GeneralSettingsProvider) {
    this.setLangAndDirction();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

  setLangAndDirction() {
    this.storage.get('tc').then((tcr) => {
      if (tcr) {
        this.settings.themeColor = tcr;
      }
    });
    this.storage.get('lang').then((result) => {
      debugger;
      if (result == 'ar') {
        this.IOS_BACK = "عودة";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
        this.storage.set('lang', 'ar');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.settings.side = 'right';
      }
      else if (result == 'en') {
        this.IOS_BACK = "Back";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }

        this.storage.set('lang', 'en');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }
      else if (result == 'ur') {
        this.IOS_BACK = "پیچھے";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }

        this.storage.set('lang', 'ur');
        this.translate.setDefaultLang('ur');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ur', true);
        this.settings.side = 'right';
      }
      else {
        this.IOS_BACK = "Back";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }

        this.storage.set('lang', 'en');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }


    });
  }

}
