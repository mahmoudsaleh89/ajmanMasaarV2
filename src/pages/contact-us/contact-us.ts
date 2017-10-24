import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtr: ModalController,
              public settings: GeneralSettingsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
  }


  closeModal() {
    this.navCtrl.pop();
  }

  onGoToFormPage() {
    this.navCtrl.setRoot('ContactFormPage')
  }

}
