import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {BalanceProvider} from "../../providers/balance/balance";
import {AccountProvider} from "../../providers/account/account";
import {Ndef, NFC} from "@ionic-native/nfc";
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage'

@IonicPage()
@Component({
  selector: 'page-check-masaar-card-ios',
  templateUrl: 'check-masaar-card-ios.html',
})
export class CheckMasaarCardIosPage {
  value: number = 5;
  showBalanceIos = false;
  tagIdValue;
  paymentResult: boolean;
  cardSerial: string;
  cardResult: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public settings: GeneralSettingsProvider,
              public balance: BalanceProvider,
              public account: AccountProvider,
              private nfc: NFC,
              private platform: Platform,
              private ndef: Ndef,
              public toastCtrl: ToastController,
              public alertCtrl: AlertController,
              private theInAppBrowser: InAppBrowser,
              public  translate: TranslateService,
              public storage: Storage) {


    /*this.platform.ready().then(() => {

    });*/


  }

  ionViewDidEnter() {
    if (this.platform.is('android')) {
      this.checkNFC();
      this.nfc.addNdefListener().subscribe(nfcData => {
      });
    }
    console.log(this.platform.is('android'), 'anroid');
    console.log(this.platform.is('ios'), 'ios');

  }

  setInput(valuex) {
    this.value = valuex;
  }

  onTopupBalance() {
    this.balance.getIPAddress(this.value).then((res) => {
      console.log(res);
      if (res) {
        this.balance.getPaymetEncryptedKey(this.account.userLoginSuccess.Phone, this.value, this.account.userLoginSuccess.FullName, this.account.userLoginSuccess.FullName, this.account.userLoginSuccess.Email, this.account.userLoginSuccess.Id)
          .then((keyRes) => {
            debugger;
            if (keyRes) {
              this.onStartPaement(keyRes);
            }
          });
      }
      let encryptedKey = res;
      console.log(['hollllalala', encryptedKey]);
    });

    /*this.balance.onTopupBalance(this.tagIdValue, this.account.userLoginSuccess.Id, this.value);*/
    /* this.navCtrl.popTo('MyWalletPage');*/

  }

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
        debugger;
        this.balance.onGetMasaarCardBalance(this.tagIdValue);

        if (!tagId) {
          this.showToast('NFC NOT DETECTED')
        }
        this.showBalanceIos = true;
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
    /* this.showBalanceIosCredit = true;*/
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


  onStartPaement(key) {
    debugger;
    let formHtml: string = '';
    let value = key;
    formHtml += '<input type="hidden" value="' + value + '" id="requestParameter" name="requestParameter"/>';
    let url = "https://www.timesofmoney.com/direcpay/secure/PaymentTransactionServlet";
    let payScript = "var form = document.getElementById('ts-app-payment-form-redirect'); ";
    payScript += "form.innerHTML = '" + formHtml + "';";
    payScript += "form.action = '" + url + "';";
    payScript += "form.method = 'POST';";
    payScript += "form.submit();";

    let browser = this.theInAppBrowser.create('payment.html', '_blank', 'location=no');
    browser.show();
    this.paymentResult = false;
    browser.on("loadstart")
      .subscribe(
        event => {
          console.log("loadstop our console -->", event.url);

          if (event.url.indexOf(".jsp") > -1 || event.url.indexOf("incube") > -1) {
            this.paymentResult = false;
            browser.close();
          } else if (event.url.indexOf('www.at.gov.ae') > -1) {
            this.balance.onTopupBalance(this.tagIdValue, this.account.userLoginSuccess.Id, this.value)
              .then((isPaementSuccess) => {
                if (isPaementSuccess) {
                  if (isPaementSuccess === true) {

                    this.paymentResult = true;
                    browser.close();
                  } else {
                    this.paymentResult = false;
                    browser.close();
                  }
                }
              });
          }
        },
        err => {
          /*this.navCtrl.popTo(TopupMasaarCardPage);*/
          console.log("InAppBrowser loadstart Event Error: " + err);
        });
    //on url load stop
    browser.on("loadstop")
      .subscribe(
        event => {
          browser.executeScript({
            code: payScript
          });
          console.log("loadstart -->", event);
        },
        err => {
          console.log("InAppBrowser loadstop Event Error: " + err);
        });

    //on closing the browser
    browser.on("exit")
      .subscribe((event) => {
          console.log("exit -->", event);

          if (this.paymentResult === true) {
            this.navCtrl.pop();
          }
          else {
            this.toastCtrl.create({
              message: 'Payment proccess was canceled',
              duration: 3000
            }).present();


          }
          /*this.navCtrl.popTo(TopupMasaarCardPage);*/
        },
        err => {
          console.log("InAppBrowser loadstart Event Error: " + err);
          /*this.navCtrl.popTo(TopupMasaarCardPage);*/
        });

  }

  CheckCardBySerial() {

    this.balance.onGetMasaarCardBalanceBySerial(this.cardSerial).then((res) => {


      if (res) {
        this.cardResult = res;
        this.tagIdValue = this.cardResult.Card_ID;
        this.balance.massarCardBlance = this.cardResult.Balance;
        this.showBalanceIos = true;
      }

    });
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
