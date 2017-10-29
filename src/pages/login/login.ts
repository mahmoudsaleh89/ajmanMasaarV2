import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {NgForm} from "@angular/forms";
import {Storage} from '@ionic/storage';
import {AccountProvider} from "../../providers/account/account";
import {VerificationCodePage} from "../verification-code/verification-code";
import {Ndef, NFC} from "@ionic-native/nfc";
import {BalanceProvider} from "../../providers/balance/balance";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user: any;
  tabSet = 'login';
  tagIdValue: any;
  username: any;
  pass: any;
  usePayment = false;
  next: any;
  tempformData: any;
  code: any;
  usecard: false;
  masarType: any;
  cardNumber: any;
  tempUser: any;
  progress: boolean;
  PaymentAlert : string;
  PaymentAlertQus:string;
  Disagree:string;
  Agree: string;
  NFC_DISABLED:string;
  OK:string;
  GO_SETTING:string;
  NFC_NOT_DETECTED:string;
  NFC_Failed:string;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public settings: GeneralSettingsProvider,
              public storage: Storage,
              public toastCtrl: ToastController,
              public account: AccountProvider,
              public alertCtrl: AlertController,
              private nfc: NFC,
              private platform: Platform,
              private ndef: Ndef,
              public balance: BalanceProvider,
              public translate: TranslateService) {
    this.setLangAndDirction();

  }

  ionViewDidEnter() {
    /*this.platform.ready().then(() => {*/
    if (this.platform.is('android')) {
      this.checkNFC();
      this.nfc.addNdefListener().subscribe(nfcData => {
      });
    }


    /*});*/
  }

  onSignin(form: NgForm) {

    let userName = form.value.username;
    let pass = form.value.password;
    this.account.onSignin(userName, pass).then(() => {
      debugger;
      if (this.account.userLoginSuccess) {
        let configInfo = {
          themeColor: this.settings.themeColor,
          statusBarColor: this.settings.statusBarColor,
          isLoggedIn: true,
          lang: 'en',
          user: this.account.userLoginSuccess,
          cardInfo: this.account.cardInfo,
          massarCard: this.account.massarCard
        }
        console.log(JSON.stringify(this.account.userLoginSuccess))
        this.storage.set('config', configInfo);
        this.settings.isLoggedIn = true;
        this.navCtrl.setRoot('HomePage');
      } else {
        console.log(JSON.stringify(this.account.userLoginSuccess))
      }
    });

  }


  skip() {
    this.navCtrl.setRoot('HomePage');
  }

  onSignUp(form: NgForm) {
    debugger;
    if (this.progress) {
      return;
    }
    this.progress = true;
    console.log(form.value);
    this.code = form.value.code;
    if (this.code == '') {
      this.code = '+971';
    } else {
      this.code = form.value.code;
    }
    if (this.tagIdValue) {
      this.masarType = 'NFC';
      this.cardNumber = this.tagIdValue;

    } else if ((this.tagIdValue == '' || this.tagIdValue == undefined) && (form.value.cardidios)) {
      this.masarType = 'serial';
      this.cardNumber = form.value.cardidios;
    } else {
      this.masarType = 'NFC';
      this.cardNumber = '';
    }


    this.alertCtrl.create({
      title: this.PaymentAlert,
      message: this.PaymentAlertQus,
      buttons: [
        {
          text: this.Disagree,
          handler: () => {
            debugger;
            this.usePayment = false;
            debugger;
            this.tempUser = {
              Username: form.value.username,
              Password: form.value.password,
              FirstName: form.value.firstName,
              LastName: form.value.lastName,
              Phone: this.code + form.value.phone,
              NFCCardId: this.cardNumber,
              MasaarType: this.masarType
            }
            this.account.onVerifySubscriper(form.value.username, form.value.firstName, form.value.lastName, form.value.password, this.code, form.value.phone, this.cardNumber, '', '', '', this.masarType).then(() => {
              debugger;
              this.progress = false;
              if (this.account.userLoginSuccess) {
                this.onGoToVerificationCodePage();
              } else {
                return;
              }
            });
          }
        },
        {
          text: this.Agree,
          handler: () => {
            debugger;
            this.progress = false;
            this.tempformData = form.value;
            console.log(this.tempformData);
            this.usePayment = true;
          }
        }
      ]
    }).present()
  }

  onSignUpFull(formFull: NgForm) {
    debugger;
    if (this.progress) {
      return;
    }
    this.progress = true;
    if (this.usePayment) {
      this.account.onVerifySubscriper(this.tempformData.username, this.tempformData.firstName, this.tempformData.lastName, this.tempformData.password, this.code, this.tempformData.phone, this.cardNumber, formFull.value.pobox, formFull.value.email, formFull.value.billingaddress, this.masarType)
        .then(() => {
          debugger;
          this.progress = false;
          if (this.account.userLoginSuccess) {
            this.tempUser = {
              Username: this.tempformData.username,
              Password: this.tempformData.password,
              FirstName: this.tempformData.firstName,
              LastName: this.tempformData.lastName,
              Phone: this.code + this.tempformData.phone,
              NFCCardId: this.cardNumber,
              MasaarType: this.masarType,
              POBox: formFull.value.pobox,
              Email: formFull.value.email,
              BillingAddress: formFull.value.billingaddress
            }
            this.onGoToVerificationCodePage();

          }
        });
    }
  }

  onGoToVerificationCodePage() {
    debugger;
    this.progress = false;
    this.navCtrl.push('VerificationCodePage', {
      phone: this.account.userLoginSuccess.Phone,
      user: this.tempUser
    });

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
    this.showToast(this.NFC_Failed);
  }

  onReceivedNFC() {
    this.nfc.addNdefListener().subscribe(nfcData => {

    });
  }

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      debugger;
      if (result == 'ar') {
        this.PaymentAlert = "خدمات الدفع !";
        this.PaymentAlertQus="هل ترغب بأستخدام عمليات الدفع المتوفرة لدينا ؟";
        this.Disagree="مواقف";
        this.Agree= "غير موافق";
        this.NFC_DISABLED=" NFC تم ايقاف";
        this.OK="نعم";
        this.GO_SETTING="الذهاب للأعدادات";
        this.NFC_NOT_DETECTED="لايوجد NFC";
        this.NFC_Failed="NFC معطل";
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.settings.side = 'right';
      } else if (result == 'en') {
        this.PaymentAlert = " Payment Alert !";
        this.PaymentAlertQus="do you want use our payment method ?";
        this.Disagree="Disagree";
        this.Agree= "Agree";
        this.NFC_DISABLED="NFC DISABLED";
        this.OK="OK";
        this.GO_SETTING="GO SETTING";
        this.NFC_NOT_DETECTED="NFC NOT DETECTED";
        this.NFC_Failed="NFC Failed";
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }else if (result == 'ur') {
        this.PaymentAlert = "ادائیگی کی انتباہ !";
        this.PaymentAlertQus="آپ اپنا ادائیگی کا طریقہ استعمال کرنا چاہتے ہیں ؟ ";
        this.Disagree="متفق ہوں";
        this.Agree= "اتفاق";
        this.NFC_DISABLED="این ایف سی کی خرابی";
        this.OK="ٹھیک ہے\n";
        this.GO_SETTING="سیٹنگنگ جاؤ";
        this.NFC_NOT_DETECTED="NFC وضاحت نہیں کی";
        this.NFC_Failed="NFC ناکام";
        this.storage.set('lang', 'ur');
        this.translate.setDefaultLang('ur');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ur', true);
        this.settings.side = 'right';
      }
      else {
        this.PaymentAlert = " Payment Alert !";
        this.PaymentAlertQus="do you want use our payment method ?";
        this.Disagree="Disagree";
        this.Agree= "Agree";
        this.NFC_DISABLED="NFC DISABLED";
        this.OK="OK";
        this.GO_SETTING="GO SETTING";
        this.NFC_NOT_DETECTED="NFC NOT DETECTED";
        this.NFC_Failed="NFC Failed";
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }

    });
  }

}
