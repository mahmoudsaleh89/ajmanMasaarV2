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
  NFC_DISABLED: string;
  OK: string;
  GO_SETTING: string;
  NFC_NOT_DETECTED: string;

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
        subTitle: this.NFC_DISABLED,
        buttons: [{text: this.OK},
          {
            text: this.GO_SETTING,
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
          this.showToast(this.NFC_NOT_DETECTED)
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
        this.NFC_DISABLED="NFC تم ايقاف";
        this.OK="موافق";
        this.GO_SETTING="أذهب الى الأعدادات";
        this.NFC_NOT_DETECTED="لم يتم العثور على NFC";
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.settings.side = 'right';
      } else if (result == 'en') {
        this.NFC_DISABLED="NFC DISABLED";
        this.OK="OK";
        this.GO_SETTING="GO SETTING";
        this.NFC_NOT_DETECTED="NFC NOT DETECTED";
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }else if (result == 'ur') {
        this.storage.set('lang', 'ur');
        this.translate.setDefaultLang('ur');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ur', true);
        this.settings.side = 'right';
      }
      else {
        this.NFC_DISABLED="NFC DISABLED";
        this.OK="OK";
        this.GO_SETTING="GO SETTING";
        this.NFC_NOT_DETECTED="NFC NOT DETECTED";
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }

    });
  }

}
