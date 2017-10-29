import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {AccountProvider} from "../../providers/account/account";
import {Storage} from '@ionic/storage';
import {NgForm} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  user: any;
  themecolor: string = 'orange';
  language: string = 'English';
  searchRoute: string = 'lesswalk';
  editMode: boolean = false;
  configInfo: any;
  code: any;
  /*translate issue*/
  Warning: string;
  Msg: string;
  SaveChanges: string;
  DiscardChanges: string;
  SavingData: string;
  @ViewChild('myForm', {read: NgForm}) myForm: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public acc: AccountProvider,
              public settings: GeneralSettingsProvider,
              public storage: Storage,
              public alertCtr: AlertController,
              public translate: TranslateService,
              public platform: Platform,
              public loadingCtrl: LoadingController) {
    this.setLangAndDirction();
  }

  ionViewDidLoad() {

  }

  onSelectTheme(data) {
    this.themecolor = data;
    this.settings.themeColor = data;
    this.storage.set('statusBarColor', data);
    this.storage.set('themeColor', this.settings.themeColor)
  }

  closeEditMode() {
    this.alertCtr.create({
      title: this.Warning,
      message: this.Msg,
      buttons: [
        {
          text: this.SaveChanges,
          handler: () => {
            this.editMode = false;
          }
        },
        {
          text: this.DiscardChanges,
          handler: () => {
            console.log('Disagree clicked');
            this.editMode = false;
          }
        }
      ]
    }).present();

  }

  saveAndUpdate() {
    //Call Api to update info
  }

  openEditMode() {
    if (this.editMode) {
      //This is save area And requset api update

      this.editMode = false;
    } else {
      this.editMode = true;
    }
  }

  onUpdatePersonalSettings() {
    this.myForm.onSubmit();
    debugger;
    console.log(JSON.stringify(this.myForm.value));
    this.configInfo = {
      themeColor: 'm-orange',
      statusBarColor: 'e16c28',
      isLoggedIn: true,
      lang: this.myForm.value.language,
      user: {
        "Id": this.acc.userLoginSuccess.Id,
        "Email": this.myForm.value.email,
        "NFCDeviceId": null,
        "NFCCardId": null,
        "UseDeviceAsCard": null,
        "Phone": this.acc.userLoginSuccess.Phone,
        "HasSpecialNeeds": null,
        "SpecialNeedAccountApproved": null,
        "Password": "123456",
        "Username": "m.saleh",
        "FirstName": this.myForm.value.firstName,
        "LastName": this.myForm.value.lastName,
        "POBox": this.myForm.value.pobox,
        "BillingAddress": this.myForm.value.billingaddress
      },
      cardInfo: this.acc.cardInfo,
      massarCard: this.acc.massarCard
    }

    switch (this.myForm.value.themecolor) {
      case 'Orange':
        this.configInfo.themeColor = 'm-orange';
        this.settings.themeColor = 'm-orange';
        break;
      case 'Pink':
        this.configInfo.themeColor = 'm-pink';
        this.settings.themeColor = 'm-pink';
        break;
      case 'Dark blue':
        this.configInfo.themeColor = 'm-dark-blue';
        this.settings.themeColor = 'm-dark-blue';
        break;
      case 'Light blue':
        this.configInfo.themeColor = 'm-blue';
        this.settings.themeColor = 'm-blue';
        break;
      case 'Brown':
        this.configInfo.themeColor = 'm-brown';
        this.settings.themeColor = 'm-brown';
        break;
    }
    switch (this.myForm.value.language) {
      case 'arabic':
        this.configInfo.lang = 'ar';
        this.settings.themeColor = 'ar';
        this.SavingData = 'جاري حفظ الاعدادات';
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        break;
      case 'english':
        this.configInfo.lang = 'en';
        this.settings.lang = 'en';
        this.SavingData = 'Saving your changes';
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        break;
      case 'urdu':
        this.translate.setDefaultLang('ur');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ur', true);
        this.configInfo.lang = 'ur';
        this.settings.lang = 'ur';
        break;
    }
    debugger;
    let loader = this.loadingCtrl.create({
      content: this.SavingData,
      duration: 3000
    });
    loader.present();
    this.acc.updateUserInfo(this.acc.userLoginSuccess.Id, this.myForm.value.firstName, this.myForm.value.lastName, this.myForm.value.pobox, this.myForm.value.email, this.myForm.value.billingaddress)
      .then((data) => {
        debugger;
        if (data) {
          this.configInfo.user = data;
          this.storage.set('config', this.configInfo);
          this.acc.userLoginSuccess = data;
          this.storage.set("lang", this.configInfo.lang);
          this.storage.set("tc", this.configInfo.themeColor);
          loader.dismiss();
          /*this.platform.*/
          this.navCtrl.setRoot('HomePage');
        }
      });

    /* console.log(form.value);*/
    console.log(this.myForm.value);
    this.editMode = false;
  }


  onSignOut() {
    let configInfo = {
      themeColor: 'm-orange',
      statusBarColor: 'e16c28',
      isLoggedIn: false,
      lang: 'en',
      user: {},
      cardInfo: {},
      massarCard: 'XX.00'
    }
    this.acc.isLoggedIn = false;
    this.settings.isLoggedIn = false;
    this.acc.cardInfo = {};
    this.acc.massarCard = 'XX.00';
    this.storage.set('config', configInfo);
    this.navCtrl.popTo('HomePage');
  }

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      debugger;
      if (result == 'ar') {
        this.Warning = "تحذير !";
        this.Msg = "لم تقم بحفظ الاعدادت,هل انت متأكد؟";
        this.SaveChanges = "حفظ التعديلات";
        this.DiscardChanges = "الغاء التعديلات";
        this.SavingData = 'جاري حفظ الاعدادات';
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.settings.side = 'right';
      } else if (result == 'en') {
        this.Warning = "Warning !";
        this.Msg = "You will lose all changes , what do you want ?";
        this.SaveChanges = "Save changes";
        this.DiscardChanges = "Discard changes";
        this.SavingData = 'Saving your changes';
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
        this.Warning = "Warning !";
        this.Msg = "You will lose all changes , what do you want ?";
        this.SaveChanges = "Save changes";
        this.DiscardChanges = "Discard changes";
        this.SavingData = 'Saving your changes';
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }
    });
  }
}
