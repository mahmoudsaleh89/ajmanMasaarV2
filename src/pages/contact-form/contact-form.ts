import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {NgForm} from "@angular/forms";
import {EmailComposer} from "@ionic-native/email-composer";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-contact-form',
  templateUrl: 'contact-form.html',
})
export class ContactFormPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public settings: GeneralSettingsProvider,
              public emailComposer: EmailComposer,
              public storage: Storage,
              public translate: TranslateService,
              public platform: Platform) {
    this.setLangAndDirction();
  }

  ionViewDidLoad() {
    this.emailComposer.hasPermission().then((res) => {
      if (res) {
        console.log(res);
      } else {
        this.emailComposer.requestPermission().then((perReq) => {
          if (!perReq) {
            this.navCtrl.pop();
          }
        });
      }
    });
    console.log('ionViewDidLoad ContactFormPage');
  }

  onSendContactForm(form: NgForm) {
    console.log(form.value)
    debugger;
    this.emailComposer.isAvailable().then((available) => {
      debugger;
      let email = {
        to: 'info@at.gov.ae',
        subject: 'Masaar App inquiry',
        body: form.value.description + '  ' + ' Sender phone:' + form.value.phone,
        isHtml: false
      };
      // Send a text message using default options
      this.emailComposer.open(email);
    }).catch((rej) => {
      debugger;
      console.log(rej);
    });

  }

  onback() {
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
