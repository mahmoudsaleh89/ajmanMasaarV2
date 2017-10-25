import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {BalanceProvider} from "../../providers/balance/balance";
import {AccountProvider} from "../../providers/account/account";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-topup-my-account',
  templateUrl: 'topup-my-account.html',
})
export class TopupMyAccountPage {

  value: number = 5;
  paymentResult: boolean;
  progress: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public settings: GeneralSettingsProvider,
              public balance: BalanceProvider,
              public account: AccountProvider,
              private theInAppBrowser: InAppBrowser,
              public toastCtrl: ToastController,
              public translate: TranslateService,
              public platform: Platform,
              public storage: Storage) {
    this.setLangAndDirction();
  }

  ionViewDidLoad() {

  }

  setInput(valuex) {
    this.value = valuex;
  }

  onTopupBalance() {
    if (this.progress) {
      return;
    }
    this.progress = true;
    this.balance.getIPAddress(this.value).then((res) => {
      console.log(res);
      if (res) {
        this.balance.getPaymetEncryptedKey(this.account.userLoginSuccess.Phone, this.value, this.account.userLoginSuccess.FullName, this.account.userLoginSuccess.FullName, this.account.userLoginSuccess.Email, this.account.userLoginSuccess.Id)
          .then((keyRes) => {
            debugger;
            this.progress = false;
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

    let browser = this.theInAppBrowser.create('payment.html', '_blank', 'location=yes');
    browser.show();
    /* this.paymentResult = false;*/
    browser.on("loadstart")
      .subscribe(
        event => {
          debugger;
          console.log("loadstop our console -->", event.url);

          if (event.url.indexOf("incube") > -1) {
            this.paymentResult = false;
            browser.close();
            debugger;
            this.progress = false;
          } else if (event.url.indexOf('www.at.gov.ae') > -1) {
            this.balance.onTopupBalance(this.account.userLoginSuccess.NFCCardId, this.account.userLoginSuccess.Id, this.value)
              .then((isPaementSuccess) => {
                if (isPaementSuccess) {
                  if (isPaementSuccess === true) {
                    debugger;
                    this.paymentResult = true;
                    this.progress = false;
                    browser.close();
                  } else {
                    this.progress = false;
                    this.paymentResult = false;
                    browser.close();
                  }
                }
              });
          }
        },
        err => {
          debugger;
          this.progress = false;
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
              message: 'Payment process was canceled',
              duration: 3000
            }).present();


          }
          /*this.navCtrl.popTo(TopupMasaarCardPage);*/
        },
        err => {
          this.progress = false;
          console.log("InAppBrowser loadstart Event Error: " + err);
          /*this.navCtrl.popTo(TopupMasaarCardPage);*/
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
