import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {AlertController, NavController, ToastController} from "ionic-angular";
import {Storage} from '@ionic/storage';
import {GeneralSettingsProvider} from "../general-settings/general-settings";

@Injectable()
export class AccountProvider {
  data;
  userLoginSuccess: any;
  errorApi: any;
  msg: string;
  cardInfo: any;
  massarCard: any;
  isLoggedIn: boolean;


  constructor(public http: Http,
              public toastCtrl: ToastController,
              public alertCtrl: AlertController,
              public storage: Storage) {

  }


  onSignin(username, password) {
    this.data = {
      Username: username,
      Password: password
    }
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers})
    return new Promise(resolve => {
      this.http.post('http://151.253.35.253:9015/MasaarWebAPI/api/Subscribers/loginSubscriber', this.data, options).map(res => res.json())
        .subscribe(data => {
          debugger;
          this.userLoginSuccess = data;
          /*this.storage.set('Incubeuser', data);
          this.storage.set('isLoggedIn', true);
          this.isLoggedIn = true;*/
          this.onGetMasaarCardInfo(this.userLoginSuccess.NFCCardId);
          resolve(this.userLoginSuccess);
        }, (err) => {
          this.errorApi = 'err';
          if (err.status == 406) {
            this.toastCtrl.create({
              message: 'Wrong user name or password',
              duration: 5000,
              position: 'middle'
            }).present();
            this.storage.set('Incubeuser', {});
            this.storage.set('isLoggedIn', false);
            this.isLoggedIn = false;
          }

        });
    });
  }

  addSubscriber(userData) {
    debugger;
    this.data = userData;
    console.log(JSON.stringify(this.data));
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers})
    return new Promise(resolve => {
      this.http.post('http://151.253.35.253:9015/MasaarWebAPI/api/Subscribers/addSubscriber', this.data, options).map(res => res.json())
        .subscribe(data => {
          debugger;
          if (data) {
            resolve(data);
          }

        }, (err) => {
          debugger;
          console.log(err);

        });
    });
  }

  onVerifySubscriper(username, firstname, lastname, password, code, phone, cardsID, pobox, email, billingAddress, masarType) {
    debugger;
    this.data = {
      Username: username,
      Password: password,
      FirstName: firstname,
      LastName: lastname,
      Phone: code + phone,
      NFCCardId: cardsID,
      Email: email,
      POBox: pobox,
      BillingAddress: billingAddress,
      MasaarType: masarType
    }
    console.log(JSON.stringify(this.data));
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers})
    return new Promise(resolve => {
      this.http.post('http://151.253.35.253:9015/MasaarWebAPI/api/Subscribers/validateSubscriber', this.data, options).map(res => res.json())
        .subscribe(data => {
          if (data == 0) {
            debugger;
            this.userLoginSuccess = this.data;
            resolve(this.userLoginSuccess);
          } else if (data == 3) {
            this.alertCtrl.create({
              title: 'Error!',
              subTitle: 'This phone number already registered !',
              buttons: ['OK']
            }).present();
            return;
          } else if (data == 4) {
            this.alertCtrl.create({
              title: 'Error!',
              subTitle: 'This user name already reserved !',
              buttons: ['OK']
            }).present();
            return;
          }

        }, (err) => {
          this.errorApi = 'err';
          /*this.toastCtrl.create({
            message: JSON.stringify(err),
            duration: 10000
          }).present();*/

        });
    });
  }

  onVerifyCode(phone, code) {

    let msg = 'Your Masar verification number is';
    this.http.get('http://www.smsglobal.com/http-api.php?action=sendsms&user=ajmant&password=5ud9gjgd&from=AJtransport&to=' + phone + '&text=' + msg + ' ' + code).map(res => res.json())
      .subscribe(data => {
        console.log(data);
      });
  }

  onGetMasaarCardInfo(cardID) {
    this.http.get('http://151.253.35.253:9015/MasaarWebAPI/api/Cards/GetCard?Cardid=' + cardID).map(res => res.json())
      .subscribe(data => {
        this.cardInfo = data;
        this.massarCard = data.Balance;
        this.storage.get('config').then((res) => {
          if (res) {
            let configInfo = res;
            configInfo.cardInfo = this.cardInfo;
            configInfo.massarCard = this.massarCard;
            this.storage.set('config', configInfo);
          }
        });
      });
  }

  updateUserInfo(id, firstname, lastname, pobox, email, billingAddress) {
    debugger;
    this.data = {
      Id: id,
      FirstName: firstname,
      LastName: lastname,
      Email: email,
      POBox: pobox,
      BillingAddress: billingAddress
    }
    console.log(JSON.stringify(this.data));
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers})
    return new Promise(resolve => {
      this.http.post('http://151.253.35.253:9015/MasaarWebAPI/api/Subscribers/UpdateSubscriber', this.data, options).map(res => res.json())
        .subscribe(data => {
          debugger;
          if (data) {
            debugger;
            this.userLoginSuccess = data;
            resolve(this.userLoginSuccess);
          }
        }, (err) => {
          debugger;
          this.errorApi = 'err';
        });
    });
  }

}
