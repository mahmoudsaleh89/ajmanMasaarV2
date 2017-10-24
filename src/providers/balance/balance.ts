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
    return new Promise(resolve => {
      this.http.get('http://www.at.gov.ae:7007/APTCOnlineWebservices/APTCOnline.asmx/IncubePaymentRequest?referenceNumber=' + userPhone + '&amount=' + ammount + '&firstName= ' + firstName + '&lastName=' + lastName + '&billingAddress1=Ajman&billingAddress2=Ajman&city=Ajman&state=Ajman&poBox=20550&countryCode=AE&emailId=' + emailId + '&mobileNumber=' + userPhone + '&loggedInUserId=' + loggedInUserId + '&createdTerminalIP=' + this.IAddress + '&returnSuccessURL=https://www.at.gov.ae&returnFailureURL=http://www.e-incube.ca').map(res => res.text())
        .subscribe(
          (theKey) => {
            this.encryptedKey = theKey.replace('<?xml version="1.0" encoding="utf-8"?>', '').replace('<string xmlns="http://tempuri.org/">', '').replace('</string>', '').trim();
            return resolve(this.encryptedKey);
          })

    });

    /*.subscribe(data => {

      this.encryptedKey = data.replace('<?xml version="1.0" encoding="utf-8"?>', '').replace('<string xmlns="http://tempuri.org/">', '').replace('</string>', '').trim();
      let formHtml: string = '';
      let value = this.encryptedKey;

      console.log(value);
      formHtml += '<input type="hidden" value="' + value + '" id="requestParameter" name="requestParameter"/>';

      let url = "https://test.timesofmoney.com/direcpay/secure/PaymentTransactionServlet";
      let payScript = "var form = document.getElementById('ts-app-payment-form-redirect'); ";
      payScript += "form.innerHTML = '" + formHtml + "';";
      payScript += "form.action = '" + url + "';";
      payScript += "form.method = 'POST';";
      payScript += "form.submit();";

      let browser = this.theInAppBrowser.create('payment.html', '_blank', 'location=no');
      browser.show();
      browser.on("loadstart")
        .subscribe(
          event => {
            console.log("loadstop -->", event);
            if (event.url.indexOf("some error url") > -1) {
              browser.close();
              /!* this.navCtrl.setRoot('HomePage', {
                 success: false
               });*!/
            }
          },
          err => {
            console.log("InAppBrowser loadstart Event Error: " + err);
          });
      //on url load stop
      browser.on("loadstop")
        .subscribe(
          event => {
            //here we call executeScript method of inappbrowser and pass object
            //with attribute code and value script string which will be executed in the inappbrowser
            browser.executeScript({
              code: payScript
            });
            console.log("loadstart -->", event);
          },
          err => {
            console.log("InAppBrowser loadstop Event Error: " + err);
          });

      //on closing the browser
      browser.on("exit")
        .subscribe((event) => {
            console.log("exit -->", event);
          },
          err => {
            console.log("InAppBrowser loadstart Event Error: " + err);
          });

    }, (err) => {

      console.log(err);
    });*/
  }


}
