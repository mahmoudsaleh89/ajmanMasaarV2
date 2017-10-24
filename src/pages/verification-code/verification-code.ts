import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {AccountProvider} from "../../providers/account/account";
import {NgForm} from "@angular/forms";
import {Storage} from '@ionic/storage'
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";

@IonicPage()
@Component({
  selector: 'page-verification-code',
  templateUrl: 'verification-code.html',
})
export class VerificationCodePage {
  verifyCode: any;
  phone: any;
  storeCode: any;
  user: any;
  inactive = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public account: AccountProvider,
              public storage: Storage,
              public toastCtrl: ToastController,
              public settings: GeneralSettingsProvider) {
    this.verifyCode = Math.floor((1 + Math.random()) * 0x10000).toString(16);
    /*this.phone = this.account.userLoginSuccess.Phone;*/
    this.phone = this.navParams.get('phone');
    this.user = this.navParams.get('user');
  }

  ionViewDidLoad() {
    if (this.phone) {
      this.account.onVerifyCode(this.phone, this.verifyCode);
      this.storage.set('code', this.verifyCode);
    }
    setTimeout(() => {
      this.inactive = false;
    }, 60000)
  }


  onEditNumber() {
  }

  onVerification(form: NgForm) {

    this.storage.get('code').then((data) => {
      this.storeCode = data;
      if (this.storeCode == form.value.code) {
        debugger;

        this.account.addSubscriber(this.user).then((res) => {
          debugger;
          if (res) {
            let configInfo = {
              themeColor: this.settings.themeColor,
              statusBarColor: this.settings.statusBarColor,
              isLoggedIn: true,
              lang: 'en',
              user: res,
              cardInfo: {},
              massarCard: ''
            };
            this.account.userLoginSuccess = res;
            /* this.account.userLoginSuccess.NFCCardId = res.NFCCardId;*/
            this.storage.set('config', configInfo);
            this.settings.isLoggedIn = true;
            this.storage.set('isLoggedIn', true);
            this.account.isLoggedIn = true;
            if (this.account.userLoginSuccess.NFCCardId) {
              debugger;
              this.account.onGetMasaarCardInfo(this.account.userLoginSuccess.NFCCardId)
            }
            this.navCtrl.setRoot('HomePage');
          }


        });
      } else {
        debugger;
        this.toastCtrl.create({
          message: "code you entered didn't match ",
          duration: 3000
        }).present();
      }
    });
  }

  onResendVerifyCode() {
    this.storage.get('code').then((data) => {
        this.storeCode = data;
        this.inactive = true;
        this.account.onVerifyCode(this.phone, this.storeCode);
      }
    );

  }

}