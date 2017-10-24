import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {NgForm} from "@angular/forms";


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
              public tstCTR: ToastController) {
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
}
