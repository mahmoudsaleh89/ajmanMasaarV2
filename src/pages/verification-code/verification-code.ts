import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {AccountProvider} from "../../providers/account/account";
import {NgForm} from "@angular/forms";
import {Storage} from '@ionic/storage';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {TranslateService} from "@ngx-translate/core";
import {FCM} from "@ionic-native/fcm";

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
  CodeErr: string;

  IOS_BACK: string;
  @ViewChild(Navbar) navbar: Navbar;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public account: AccountProvider,
              public storage: Storage,
              public toastCtrl: ToastController,
              public settings: GeneralSettingsProvider,
              public  translate: TranslateService,
              private platform: Platform,
              public fcm: FCM) {
    this.setLangAndDirction();
    this.verifyCode = Math.floor((1 + Math.random()) * 0x10000).toString(16);
    /*this.phone = this.account.userLoginSuccess.Phone;*/
    this.phone = this.navParams.get('phone');
    this.user = this.navParams.get('user');
  }

  ionViewDidLoad() {
    if (this.phone) {
      debugger;
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
            this.storage.get('lang').then((res) => {
              if (res) {
                this.fcm.getToken().then(token => {
                  configInfo.lang = res;
                  this.settings.onSendToken(token, this.account.userLoginSuccess.Id, res);
                });
              } else {
                this.fcm.getToken().then(token => {
                  configInfo.lang = res;
                  this.settings.onSendToken(token, this.account.userLoginSuccess.Id, 'en');
                });
              }
            });


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
          message: this.CodeErr,
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

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      debugger;
      if (result == 'ar') {
        this.IOS_BACK = "عودة";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
        this.CodeErr = "الرمز الذي ادخلتة غير متطابق !";
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.settings.side = 'right';
      } else if (result == 'en') {
        this.IOS_BACK = "Back";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
        this.CodeErr = "code you entered didn't match";
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      } else if (result == 'ur') {
        this.IOS_BACK = "پیچھے";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
        this.CodeErr = "آپ نے درج کردہ کوڈ نہیں ملا";
        this.storage.set('lang', 'ur');
        this.translate.setDefaultLang('ur');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ur', true);
        this.settings.side = 'right';
      }
      else {
        this.IOS_BACK = "Back";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
        this.CodeErr = "code you entered didn't match";
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }

    });
  }

}
