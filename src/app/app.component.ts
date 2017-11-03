import {Component, ViewChild} from '@angular/core';
import {AlertController, LoadingController, MenuController, ModalController, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {GeneralSettingsProvider} from "../providers/general-settings/general-settings";

/*Pages*/
import {Storage} from '@ionic/storage';
import {AccountProvider} from "../providers/account/account";
import {HomePage} from "../pages/home/home";
import {TranslateService} from "@ngx-translate/core";
import {FCM} from "@ionic-native/fcm";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  usertemp: any;
  rootPage: any;
  massarCard: any;
  WARNING_TEAXT: string;
  PLEASE_LOGIN_MSG: string;
  LOGIN_LABLE: string;
  CANCEL_LABEL: string;
  pages: Array<{ title: string, subtitle: string, component: any, icon: string }>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public settings: GeneralSettingsProvider,
              public storage: Storage,
              public account: AccountProvider,
              public menuCtrl: MenuController,
              public alertCtr: AlertController,
              public modalCtrl: ModalController,
              public translate: TranslateService,
              public fcm: FCM) {

    this.initializeApp();
    this.pages = [
      {
        title: 'JOURNY_PLANNER',
        component: 'HomePage',
        subtitle: 'JOURNY_PLANNER_DESC',
        icon: 'md-trending-up'
      },
      {title: 'MY_WALLET', subtitle: 'MY_WALLET_DESC', component: 'MyWalletPage', icon: 'briefcase'},
      /*{
        title: 'Rate this app',
        subtitle: 'We care about your opinion',
        component: 'HappinessMeterPage',
        icon: 'star'
      },*/
      {
        title: 'MY_PLACES',
        subtitle: 'MY_PLACES_DESC',
        component: 'MyPlacesPage',
        icon: 'ios-bulb'
      },
      {title: 'BUS_STATIONS', subtitle: 'BUS_STATIONS_DESC', component: 'BusStationsPage', icon: 'bus'},
      {title: 'SETTINGS', subtitle: 'SETTINGS_DESC', component: 'SettingsPage', icon: 'cog'},
      {title: 'ABOUT_US', subtitle: 'ABOUT_US_DESC', component: 'AboutPage', icon: 'information-circle'},
    ];
  }

  initializeApp() {

    this.platform.ready().then(() => {

      //area to call push notification function >>>
      this.onStartPusNotification();

      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
      this.storage.get('config').then((data) => {
        if (data.isLoggedIn) {
          console.log(data);
          this.settings.themeColor = data.themeColor;
          this.settings.statusBarColor = data.statusBarColor;
          this.settings.isLoggedIn = data.isLoggedIn;
          this.settings.lang = data.lang;
          this.usertemp = data.user;
          this.account.userLoginSuccess = data.user;
          this.account.cardInfo = data.cardInfo;
          this.account.massarCard = data.massarCard;
          if (data.lang == 'ar') {
            this.settings.side = 'right';
          } else if (data.lang == 'en') {
            this.settings.side = 'left';
          } else if (data.lang == 'ur') {
            this.settings.side = 'right';
          }
          this.account.onGetMasaarCardInfo(this.usertemp.NFCCardId);
        } else {

          let configInfo = {
            themeColor: '',
            statusBarColor: '',
            isLoggedIn: false,
            lang: 'en',
            user: {},
            cardInfo: {},
            massarCard: 'XX.00'
          }
          this.storage.set('config', configInfo);
          this.settings.themeColor = 'm-orange';
          this.settings.statusBarColor = 'ce5713';
          this.account.massarCard = 'XX.00';
          this.settings.lang = 'en';
          this.settings.side = 'left';
        }
      });
      this.storage.get('tc').then((tcr) => {
        if (tcr) {
          this.settings.themeColor = tcr;
          this.settings.statusBarColor = 'ce5713';
        } else {
          this.settings.themeColor = 'm-orange';
          this.settings.statusBarColor = 'ce5713';
        }
      })
      this.account.massarCard = 'XX.00';
      this.statusBar.backgroundColorByHexString('e16c28');

      this.storage.get('firstRun').then((first) => {
        debugger;
        if (first == false) {
          this.storage.set('firstRun', false);
          this.storage.get('lang').then((result) => {
            debugger;
            if (result == 'ar') {

              this.WARNING_TEAXT = "تنبيه";
              this.PLEASE_LOGIN_MSG = "يرجى تسجيل الدخول للاستفادة من هذة الخدمة";
              this.LOGIN_LABLE = "دخول";
              this.CANCEL_LABEL = "الغاء";
              this.translate.setDefaultLang('ar');
              this.platform.setDir('rtl', true);
              this.platform.setLang('ar', true);
              this.storage.set('lang', 'ar');
            } else if (result == 'en') {

              this.WARNING_TEAXT = "Warning";
              this.PLEASE_LOGIN_MSG = "please login to use this feature !";
              this.LOGIN_LABLE = "Login";
              this.CANCEL_LABEL = "Cancel";
              this.translate.setDefaultLang('en');
              this.platform.setDir('ltr', true);
              this.platform.setLang('en', true);
              this.storage.set('lang', 'en');
            } else if (result == 'ur') {

              this.WARNING_TEAXT = "انتباہ";
              this.PLEASE_LOGIN_MSG = "اس خصوصیت کو استعمال کرنے کے لئے لاگ ان کریں";
              this.LOGIN_LABLE = "لاگ ان";
              this.CANCEL_LABEL = "منسوخ کریں";
              this.storage.set('lang', 'ur');
              this.translate.setDefaultLang('ur');
              this.platform.setDir('rtl', true);
              this.platform.setLang('ur', true);
              this.settings.side = 'right';
            }
            else {

              this.WARNING_TEAXT = "Warning";
              this.PLEASE_LOGIN_MSG = "please login to use this feature !";
              this.LOGIN_LABLE = "Login";
              this.CANCEL_LABEL = "Cancel";
              this.storage.set('lang', 'en');
            }


            this.nav.setRoot('HomePage');
            /*  this.nav.setRoot('IntroPage');*/
          });
        } else if (first == null || first == true) {

          this.storage.set('lang', 'en');
          this.translate.setDefaultLang('en');
          /* this.platform.setDir('ltr', true);
           this.platform.setLang('en', true);*/
          this.settings.side = 'left';
          this.storage.set('firstRun', false);
          this.nav.setRoot('IntroPage');
        }
      });

    });

  }

  openPage(page) {

    if (this.settings.isLoggedIn == false && (page.component == 'MyWalletPage' || page.component == 'SettingsPage')) {
      this.nav.push('LoginPage');
    } else if (page.component == 'HomePage') {
      this.nav.setRoot(page.component)
    }
    else {
      this.nav.push(page.component);
    }

  }

  onGoToTopup() {
    /* this.nav.push('TopupMasaarCardPage');*/
    if (this.account.userLoginSuccess) {
      this.nav.push('TopupMyAccountPage');
    } else {
      /*if (this.platform.is('ios')) {*/
      this.alertCtr.create({
        title: this.WARNING_TEAXT !,
        subTitle: this.PLEASE_LOGIN_MSG,
        buttons: [
          {
            text: this.CANCEL_LABEL
          },
          {
            text: this.LOGIN_LABLE,
            handler: () => {
              this.nav.push('LoginPage');
            }
          }
        ]
      }).present()
      /*} else {
        this.nav.push('TopupMasaarCardPage');*/
    }

    /*}*/
    this.menuCtrl.close();
  }

  onGoToContactPage() {
    this.modalCtrl.create('ContactUsPage').present();
    this.menuCtrl.close();
  }

  onGoToRatePage() {
    this.modalCtrl.create('HappinessMeterPage').present();
    this.menuCtrl.close();
  }

  onStartPusNotification() {
    /*to get device token*/
    this.fcm.getToken().then(token => {
      /**/
      console.log(token);
    });
    /*to set what is going on when message recived*/
    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        console.log("Received in background");
      } else {
        console.log("Received in foreground");
      }
      /*this method for change token id*/
      this.fcm.onTokenRefresh().subscribe(token => {
        console.log(token);
      });
    })


  }

}
