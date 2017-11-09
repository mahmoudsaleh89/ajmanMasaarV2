import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {AlertController, NavController} from "ionic-angular";
import {AccountProvider} from "../account/account";
import {InAppBrowser} from '@ionic-native/in-app-browser';

@Injectable()
export class BalanceProvider {
  data: any;
  massarCardBlance;
  IAddress: any;
  encryptedKey: any;

  isPaymentSuccess: boolean;


  constructor(public http: Http,
              public alertCtrl: AlertController,
              public account: AccountProvider,
              private theInAppBrowser: InAppBrowser) {
  }

  onTopupBalance(card_id, subscriberid, amount) {

    this.data = {
      Card_ID: card_id,
      Subscriberid: subscriberid,
      amount: amount,
    }
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers})
    return new Promise(resolve => {
      this.http.post('http://151.253.35.253:9015/MasaarWebAPI/api/Cards/TopUpCard', this.data, options).map(res => res.json())
        .subscribe(data => {
          if (data) {
            this.account.cardInfo = data;
            this.account.massarCard = data.Balance;
            this.isPaymentSuccess = true;
            resolve(this.isPaymentSuccess);
          } else {
            this.isPaymentSuccess = false;
            resolve(this.isPaymentSuccess);
          }
        }, err => {
          this.isPaymentSuccess = false;
          resolve(this.isPaymentSuccess);
        });
    });
  }

  onGetMasaarCardBalance(cardID) {
    this.http.get('http://151.253.35.253:9015/MasaarWebAPI/api/Cards/GetCard?Cardid=' + cardID).map(res => res.json())
      .subscribe(data => {
        this.massarCardBlance = data.Balance;
      });
  }

  onGetMasaarCardBalanceBySerial(SerialId) {
    return new Promise(resolve => {
      this.http.get('http://151.253.35.253:9015/MasaarWebAPI/api/Cards/ValidateCardBySerial?SerialId=' + SerialId).map(res => res.json())
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  getIPAddress(ammount) {
    return new Promise(resolve => {
      this.http.get('https://api.ipify.org?format=json').map(res => res.json())
        .subscribe(data => {
          this.IAddress = data.ip;
          resolve(this.IAddress);
        }, (err) => {
        });
    });
  }

  getPaymetEncryptedKey(userPhone, ammount, firstName, lastName, emailId, loggedInUserId) {
    debugger;
    return new Promise(resolve => {
      this.http.get('http://151.253.35.253:9015/AjmanWebAPIs/api/Subscribers/GetPaymentTocken?link=referenceNumber=' + userPhone + '||amount=' + ammount + '||firstName= ' + firstName + '||lastName=' + lastName + '||billingAddress1=Ajman||billingAddress2=Ajman||city=Ajman||state=Ajman||poBox=20550||countryCode=AE||emailId=' + emailId + '||mobileNumber=' + userPhone + '||loggedInUserId=' + loggedInUserId + '||createdTerminalIP=' + this.IAddress + '||returnSuccessURL=https://www.at.gov.ae||returnFailureURL=http://www.e-incube.ca').map(res => res.text())
        .subscribe(
          (theKey) => {
            return resolve(theKey);
          }, (err) => {
          });


    });
  }


}
