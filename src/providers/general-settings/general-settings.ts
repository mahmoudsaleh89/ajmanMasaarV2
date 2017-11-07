import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {AlertController, LoadingController} from "ionic-angular";
import {Storage} from '@ionic/storage';
import {AccountProvider} from "../account/account";

@Injectable()
export class GeneralSettingsProvider {
  themeColor: any;
  loading: any;
  lang: string;
  isLoggedIn: boolean;
  user: any;
  mastercard: any;
  data: any;
  /* cardInfo:any;*/
  statusBarColor: any;
  loder: any;
  side: string;
  sortRouteIs: string = 'Best route';
  alertNotify: boolean;
  notificationList: Array<any>;

  /* massarCard:any;*/
  constructor(public http: Http,
              public loadingCtrl: LoadingController,
              public storage: Storage,
              public account: AccountProvider,
              public alretCtr: AlertController) {
    this.user = this.account.userLoginSuccess;
    if (this.user) {

      this.storage.set('user', this.user);
      this.storage.get('user').then((data) => {
        this.user = data;
      });
      this.isLoggedIn = true;
      this.storage.set('isLoggedIn', true);
    } else {
      this.isLoggedIn = false;
      this.storage.set('isLoggedIn', false);
    }

    this.storage.get('mastercard').then((data) => {
      this.mastercard = data;
    });
  }

  public AddMasterCard(cardnumber, expiry, ccv, holdername) {
    this.mastercard = {
      cardnumber: cardnumber,
      expiry: expiry,
      ccv: ccv,
      holdername: holdername

    }

    this.storage.set('mastercard', this.mastercard);
    return new Promise(resolve => {
      this.storage.get('mastercard').then((data) => {
        this.mastercard = data;
      });
      resolve(this.mastercard);

    });

  }

  presentLoading(text) {
    this.loading = this.loadingCtrl.create({
      content: text,
    }).present();
  }

  hideLoading() {
    this.loading.dismissAll()
  }

  onSendRate(rateValue, desc) {
    this.data = {
      "Description": desc,
      "RateResult": parseInt(rateValue)
    }
    console.log(JSON.stringify(this.data));
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers})
    return new Promise(resolve => {
      this.http.post('http://151.253.35.253:9015/MasaarWebAPI/api/AppRating/addrating', this.data, options).map(res => res.json())
        .subscribe(data => {
          resolve(true);
        }, (err) => {
          console.log(err);
          resolve(false);
        });
    });
  }


  onLoading(content, close) {
    debugger;
    this.loder = this.loadingCtrl.create({
      content: content,
    });
    this.loder.present()
    if (close == true) {
      debugger;
      this.loder.dismiss();
    }

  }

  closeloading() {
    debugger;

  }

  onSendToken(token, userId, lang) {
    this.data = {
      TockenID: token,
      SubscriberId: userId,
      language: lang
    };
    console.log(JSON.stringify(this.data));
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers})
    this.http.post('http://151.253.35.253:9015/MasaarWebAPI/api/PushNotification/RegisterTocken', this.data, options).map(res => res.json())
      .subscribe(data => {
        if (data) {
          console.log('hello' + data);
        }
      }, (err) => {
        debugger;
        console.log(err);
      });

  }

  onGetChartData() {
    return new Promise(resolve => {
      let msg = 'Your Masar verification number is';
      this.http.get('http://151.253.35.253:9015/MasaarWebAPI/api/Dashboard/GetDashboardData').map(res => res.json())
        .subscribe(data => {
          debugger;
          console.log(data);
          resolve(data);
        });
    });

  }
}
