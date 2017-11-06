import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              public platform: Platform,
              public storage: Storage,
              public settings: GeneralSettingsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

}
