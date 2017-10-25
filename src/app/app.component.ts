import {Component, ViewChild} from '@angular/core';
import {AlertController, MenuController, ModalController, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {GeneralSettingsProvider} from "../providers/general-settings/general-settings";

/*Pages*/
import {Storage} from '@ionic/storage';
import {AccountProvider} from "../providers/account/account";
import {HomePage} from "../pages/home/home";
import {TranslateService} from "@ngx-translate/core";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  usertemp: any;
  rootPage: any;
  massarCard: any;

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
              public translate: TranslateService) {

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
      this.settings.themeColor = 'm-orange';
      this.settings.statusBarColor = 'ce5713';
      this.account.massarCard = 'XX.00';
      this.statusBar.backgroundColorByHexString('e16c28');

      this.storage.get('firstRun').then((first) => {
        debugger;
        if (first == false) {
          this.storage.set('firstRun', false);
          this.storage.get('lang').then((result) => {
            debugger;
            if (result == 'ar') {
              this.translate.setDefaultLang('ar');
              this.platform.setDir('rtl', true);
              this.platform.setLang('ar', true);
              this.settings.side = 'right';
              this.storage.set('lang', 'ar');
            } else if (result == 'en') {
              this.translate.setDefaultLang('en');
              this.platform.setDir('ltr', true);
              this.platform.setLang('en', true);
              this.settings.side = 'left';
              this.storage.set('lang', 'en');
            }
            else {
              /*this.translate.setDefaultLang('en');
              this.platform.setDir('ltr', true);
              this.platform.setLang('en', true);*/
              this.storage.set('lang', 'en');
              this.settings.side = 'left';
            }
            this.nav.setRoot('HomePage');
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
    /*  this.platform.ready().then(() => {

        this.storage.get('themeColor').then((data) => {
          if (data) {
            this.settings.themeColor = data;
          } else {
            this.settings.themeColor = 'm-orange';
            this.storage.set('themeColor', 'm-orange');
          }
        });
        this.storage.get('statusBarColor').then((data) => {
          if (data) {
            this.statusBarColor = data;
          } else {
            this.statusBarColor = 'e16c28';
            this.storage.set('statusBarColor', 'e16c28');
          }
        });
        this.storage.get('isLoggedIn').then((data) => {
          if (data) {
            this.settings.isLoggedIn = data;
          } else {
            this.settings.isLoggedIn = false;
            this.storage.set('isLoggedIn', false);
          }
        });
        this.storage.get('lang').then((data) => {
          if (data) {
            this.settings.lang = data;
          } else {
            this.settings.lang = 'en';
            this.storage.set('lang', 'en');
          }
        });
        this.statusBar.backgroundColorByHexString('e16c28');


        this.storage.set('Incubeuser', this.usertemp);
        this.storage.get('Incubeuser').then((data) => {
          if (data) {
            this.usertemp = data
            this.settings.isLoggedIn = true;
            this.storage.set('isLoggedIn', true);
            this.storage.set('Incubeuser', this.usertemp);
            this.account.userLoginSuccess = data;
            this.account.onGetMasaarCardInfo(this.usertemp.NFCCardId);
            setTimeout(() => {
              this.splashScreen.hide();
            }, 100);
            this.nav.setRoot('HomePage');

          } else {
            this.usertemp = {};
            this.account.massarCard = 'XX.00';
            setTimeout(() => {
              this.splashScreen.hide();
            }, 100);
            this.nav.push('LoginPage');
          }


        });
      });*/
  }

  openPage(page) {

    /*if (this.settings.isLoggedIn == false && (page.component == 'MyWalletPage' || page.component == 'SettingsPage')) {
      this.nav.push('LoginPage');
    } else*/ if (page.component == 'HomePage') {
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
        title: 'Warning !',
        subTitle: 'please login to use this feature ',
        buttons: [
          {
            text: 'Cancel'
          },
          {
            text: 'Login',
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


}
