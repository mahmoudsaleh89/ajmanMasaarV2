import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {NgForm} from "@angular/forms";
import {EmailComposer} from "@ionic-native/email-composer";

@IonicPage()
@Component({
  selector: 'page-contact-form',
  templateUrl: 'contact-form.html',
})
export class ContactFormPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public settings: GeneralSettingsProvider,
              public emailComposer: EmailComposer) {
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
}
