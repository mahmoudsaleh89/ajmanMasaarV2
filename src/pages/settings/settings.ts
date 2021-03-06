import {Component, ViewChild} from '@angular/core';
import {
  ActionSheetController, AlertController, IonicPage, LoadingController, Navbar, NavController, NavParams,
  Platform
} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {AccountProvider} from "../../providers/account/account";
import {Storage} from '@ionic/storage';
import {NgForm} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {MyApp} from "../../app/app.component";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  user: any;
  /* themecolor: string = 'orange';*/
  language: string;
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
  MSG_CONFIRM_LANG: string;
  CANCEL: string;
  OK_LBL: string;

  @ViewChild('myForm', {read: NgForm}) myForm: any;

  IOS_BACK: string;
  @ViewChild(Navbar) navbar: Navbar;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public acc: AccountProvider,
              public settings: GeneralSettingsProvider,
              public storage: Storage,
              public alertCtr: AlertController,
              public translate: TranslateService,
              public platform: Platform,
              public loadingCtrl: LoadingController,
              private myAPP: MyApp,
              public actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController) {
    this.setLangAndDirction();
  }

  ionViewDidLoad() {

  }

  onSelectTheme(data) {
    /*  this.themecolor = data;*/
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

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your Language',
      buttons: [
        {
          text: 'English',
          handler: () => {
            let alert = this.alertCtrl.create({
              title: this.Warning,
              message: this.MSG_CONFIRM_LANG,
              buttons: [
                {
                  text: this.CANCEL,
                  handler: () => {
                    return;
                  }
                },
                {
                  text:this.OK_LBL,
                  handler: () => {
                    debugger;
                    this.language = "en";
                    this.storage.set("lang", this.language).then(() => {
                      this.platform.exitApp();
                    });


                  }
                }
              ]
            });
            alert.present();

          }
        },
        {
          text: 'العربية',
          handler: () => {
            let alert = this.alertCtrl.create({
              title: this.Warning,
              message: this.MSG_CONFIRM_LANG,
              buttons: [
                {
                  text: this.CANCEL,
                  handler: () => {
                    return;
                  }
                },
                {
                  text: this.OK_LBL,
                  handler: () => {
                    this.language = "ar";
                    this.storage.set("lang", this.language).then(() => {
                      this.platform.exitApp();
                    });

                  }
                }
              ]
            });
            alert.present();
          }
        },
        {
          text: 'أردو',
          handler: () => {
            let alert = this.alertCtrl.create({
              title: this.Warning,
              message: this.MSG_CONFIRM_LANG,
              buttons: [
                {
                  text: this.CANCEL,
                  handler: () => {
                    return;
                  }
                },
                {
                  text: this.OK_LBL,
                  handler: () => {
                    this.language = "ur";
                    this.storage.set("lang", this.language).then(() => {
                      this.platform.exitApp();
                    });
                  }
                }
              ]
            });
            alert.present();
          }
        }
      ]
    });

    actionSheet.present();
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
      themeColor: this.myForm.value.themecolor,
      isLoggedIn: true,
      lang: this.settings.lang,
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
    if (this.myForm.value.searchRoute == 'lesstransfers') {
      this.storage.set('routOption', 'FEWER_TRANSFERS  ');
      this.settings.sortRouteIs = 'Less transfers';
    } else if (this.myForm.value.searchRoute == 'lesswalk') {
      this.storage.set('routOption', 'LESS_WALKING ');
      this.settings.sortRouteIs = 'Less walk';
    }

    switch (this.myForm.value.themecolor) {
      case 'orange':
        this.configInfo.themeColor = 'orange';
        this.settings.themeColor = 'orange';
        break;
      case 'pink':
        this.configInfo.themeColor = 'pink';
        this.settings.themeColor = 'pink';
        break;
      case 'blue':
        this.configInfo.themeColor = 'blue';
        this.settings.themeColor = 'blue';
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
          this.myAPP.initializeApp();
          /*
                    this.navCtrl.setRoot('HomePage');*/
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
        this.language = 'العربية';
        this.IOS_BACK = "عودة";
        if(this.platform.is('ios')){
          this.MSG_CONFIRM_LANG = "يرجى اغلاق البرنامج لتطبيق الاعدادات الجديدة !";
        }else{
          this.MSG_CONFIRM_LANG = "سوف يتم اغلاق التطبيق , هل ترغب بالمتابعة؟";
        }
        this.OK_LBL = "نعم";
        this.CANCEL = "الغاء";

        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
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
        this.IOS_BACK = "Back";

        if(this.platform.is('ios')){
          this.MSG_CONFIRM_LANG = "Close the App , to make your changes take the effect !";
        }else{
          this.MSG_CONFIRM_LANG = "Your App wil be closed, do you want to proceed !";
        }
        this.OK_LBL = "Ok";
        this.CANCEL = "Cancel";

        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }

        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      } else if (result == 'ur') {
        this.Warning = "انتباہ !";
        this.Msg = "آپ تمام تبدیلیوں کو کھو دیں گے، آپ کیا چاہتے ہیں ؟ ";
        this.SaveChanges = "تبدیلیاں محفوظ کرو";
        this.DiscardChanges = "تبدیلیاں مسترد کریں";
        this.SavingData = 'آپ کی تبدیلیوں کو محفوظ کرنا';
        this.language = 'اوردو';
        this.IOS_BACK = "پیچھے";
        if(this.platform.is('ios')){
          this.MSG_CONFIRM_LANG = "اے پی پی بند کرو، اپنے تبدیلیوں کو اثر انداز کرو!";
        }else{
          this.MSG_CONFIRM_LANG = "آپ کا ایپ بند ہو جائے گا، کیا آپ آگے بڑھنا چاہتے ہیں !";
        }

        this.OK_LBL = "ٹھیک ہے";
        this.CANCEL = "منسوخ کریں";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
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
        this.language = 'English';
        this.IOS_BACK = "Back";
        if(this.platform.is('ios')){
          this.MSG_CONFIRM_LANG = "Close the App , to make your changes take the effect !";
        }else{
          this.MSG_CONFIRM_LANG = "Your App wil be closed, do you want to proceed !";
        }
        this.OK_LBL = "Ok";
        this.CANCEL = "Cancel";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }
    });
  }
}
