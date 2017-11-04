import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {NgForm} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';
import {Chart} from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-happiness-meter',
  templateUrl: 'happiness-meter.html',
})

export class HappinessMeterPage {
  sad: boolean;
  normal: boolean;
  happy: boolean;
  veryhappy: boolean;
  rateValue: any;
  desc: string;
  progress: boolean;
  thx_rate: string;
  sad_label: string = 'sad';
  normal_label: string = 'normal';
  happy_label: string = 'happy';
  veryhappy_label: string= 'very happy';
  showCharts: boolean;

  /*@ViewChild('barCanvas') barCanvas;*/
  @ViewChild('doughnutCanvas') doughnutCanvas;
/*  @ViewChild('lineCanvas') lineCanvas;*/
  barChart: any;
  doughnutChart: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public settings: GeneralSettingsProvider,
              public tstCTR: ToastController,
              public storage: Storage,
              public translate: TranslateService,
              public platform: Platform) {
    this.setLangAndDirction();
  }

  ionViewDidLoad() {
   /* this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: [this.veryhappy_label, this.happy_label, this.normal_label, this.sad_label],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
*/
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

      type: 'doughnut',
      data: {
        labels: [ this.veryhappy_label, this.happy_label, this.normal_label, this.sad_label],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36a287",
            "#36A2EB",
            "#FFCE56",
          ]
        }]
      }

    });

  }


  setRate(rate) {
    this.rateValue = rate;

    switch (rate) {
      case '1':
        this.sad = true;
        this.normal = false;
        this.happy = false;
        this.veryhappy = false;

        break;
      case '2':
        this.sad = false;
        this.normal = true;
        this.happy = false;
        this.veryhappy = false;
        break;
      case '3':
        this.sad = false;
        this.normal = false;
        this.happy = true;
        this.veryhappy = false;
        break;
      case '4':
        this.sad = false;
        this.normal = false;
        this.happy = false;
        this.veryhappy = true;
        break;
      default:
        this.sad = false;
        this.normal = false;
        this.happy = false;
        this.veryhappy = false;
    }
  }

  onSubmitRate() {
    this.progress = true;
    debugger;
    console.log(this.rateValue, this.desc);
    this.settings.onSendRate(this.rateValue, this.desc).then((res) => {
      this.progress = false;
      if (res) {
        this.tstCTR.create({
          message: this.thx_rate,
          duration: 3000
        }).present();
        this.navCtrl.popTo('HomePage');
      }
    });
  }

  onCloseModal() {
    this.navCtrl.pop();
  }

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      debugger;
      if (result == 'ar') {
        this.veryhappy_label = "سعيد جدا";
        this.happy_label = "سعيد";
        this.normal_label = "متوسط";
        this.sad_label = "حزين";
        this.thx_rate = "شكرا لك لتقيمك";
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.settings.side = 'right';
      } else if (result == 'en') {
        this.veryhappy_label = "eryhappy";
        this.happy_label = "happy";
        this.normal_label = "normal";
        this.sad_label = "sad";
        this.thx_rate = "Thanks for rating our app";
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      } else if (result == 'ur') {
        this.veryhappy_label = "بہت خوش";
        this.happy_label = "خوش ہوں";
        this.normal_label = "معمول";
        this.sad_label = "اداس";
        this.thx_rate = "ہمارے ایپ چوہا کے لئے شکریہ";
        this.storage.set('lang', 'ur');
        this.translate.setDefaultLang('ur');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ur', true);
        this.settings.side = 'right';
      }
      else {
        this.veryhappy_label = "eryhappy";
        this.happy_label = "happy";
        this.normal_label = "normal";
        this.sad_label = "sad";
        this.thx_rate = "Thanks for rat our app";
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.settings.side = 'left';
      }
    });
  }

  toggleCharts() {
    if (this.showCharts == true) {
      this.showCharts = false;
    } else {
      this.showCharts = true;
    }
  }
}
