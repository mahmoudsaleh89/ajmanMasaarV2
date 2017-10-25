import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {Storage} from '@ionic/storage'
import {BalanceProvider} from "../../providers/balance/balance";
import {Ndef, NFC} from "@ionic-native/nfc";
import {AccountProvider} from "../../providers/account/account";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-my-wallet',
  templateUrl: 'my-wallet.html',
})
export class MyWalletPage {
  tagIdValue;
  showCard: boolean;
  showAcount: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public settings: GeneralSettingsProvider,
              public toastCtrl: ToastController,
              public balance: BalanceProvider,
              private nfc: NFC,
              private platform: Platform,
              private ndef: Ndef,
              public alertCtrl: AlertController,
              public account: AccountProvider,
              public  translate: TranslateService) {
    this.setLangAndDirction();
    /*this.platform.ready().then(() => {

    });*/
  }

  ionViewDidEnter() {
    if (this.platform.is('android')) {
      this.checkNFC();
      this.nfc.addNdefListener().subscribe(nfcData => {
      });
    }
  }

  onGoToTopUp() {
    this.navCtrl.push('TopupMyAccountPage');
  }

  onGoToTopUpMasar() {
    this.navCtrl.push('TopupMasaarCardPage');
  }

  onToggelCredit() {
    if (this.showAcount) {
      this.showAcount = false;
      this.showCard = false;
    } else {
      this.showAcount = true;
      this.showCard = false;
    }
  }


  /*To add nfc*/

  checkNFC() {
    this.nfc.enabled().then(() => {
      this.addListenNFC();
    }).catch(err => {
      let alert = this.alertCtrl.create({
        subTitle: 'NFC DISABLED',
        buttons: [{text: 'OK'},
          {
            text: "GO SETTING",
            handler: () => {
              this.nfc.showSettings().then(() => {
                this.addListenNFC();
              });
            }
          }]
      });
      alert.present();
    });
  }

  addListenNFC() {
    this.nfc.addTagDiscoveredListener(nfcEvent => this.sesReadNFC(nfcEvent.tag))
      .subscribe(data => {
        let tagId = this.nfc.bytesToHexString(data.tag.id);

        this.tagIdValue = tagId;
        this.balance.onGetMasaarCardBalance(this.tagIdValue);

        if (!tagId) {
          this.showToast('NFC NOT DETECTED')
        }
        this.showCard = true;
        this.showAcount = false;
      });
  }

  showToast(data) {
    let toast = this.toastCtrl.create({
      message: data,
      duration: 3000
    });
    toast.present();
  }

  sesReadNFC(data): void {
    /* this.showCardCredit = true;*/
    /* this.showToast(JSON.stringify(data));*/
    /*if (!data) {
      this.showToast('soso nnmnjb[poiuytr');
    }*/
  }

  failNFC(err) {
    this.showToast('NFC Failed ');
  }

  onReceivedNFC() {
    this.nfc.addNdefListener().subscribe(nfcData => {

    });
  }

  onCheckBlaneios() {
    debugger;
    if (this.platform.is('ios')) {
      this.navCtrl.push('CheckMasaarCardIosPage');
    }
    else {
      return;
    }
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
