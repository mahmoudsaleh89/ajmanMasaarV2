import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Chart} from 'chart.js';
import {TranslateService} from "@ngx-translate/core";
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";


@IonicPage()
@Component({
  selector: 'page-app-review',
  templateUrl: 'app-review.html',
})
export class AppReviewPage {
  sad_label: string = 'sad';
  normal_label: string = 'normal';
  happy_label: string = 'happy';
  veryhappy_label: string = 'very happy';
  doughnutChart: any;
  analysisData: any;
  progress: boolean;
  @ViewChild('doughnutCanvas') doughnutCanvas;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public settings: GeneralSettingsProvider,
              public storage: Storage,
              public translate: TranslateService,
              public platform: Platform) {
    this.setLangAndDirction();
  }

  ionViewDidLoad() {
    this.progress = false;
    this.settings.onGetChartData().then((res) => {
      debugger;
      this.progress = true;
      this.analysisData = res;
      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: this.analysisData.labels,
          datasets: [{
            label: '# of Votes',
            data: this.analysisData.data,
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
    });
  }

  onCloseModal() {
    this.navCtrl.pop();
  }

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      if (result == 'ar') {
        this.veryhappy_label = "سعيد جدا";
        this.happy_label = "سعيد";
        this.normal_label = "متوسط";
        this.sad_label = "حزين";
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);

      } else if (result == 'en') {
        this.veryhappy_label = "eryhappy";
        this.happy_label = "happy";
        this.normal_label = "normal";
        this.sad_label = "sad";
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);

      } else if (result == 'ur') {
        this.veryhappy_label = "بہت خوش";
        this.happy_label = "خوش ہوں";
        this.normal_label = "معمول";
        this.sad_label = "اداس";
        this.storage.set('lang', 'ur');
        this.translate.setDefaultLang('ur');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ur', true);

      }
      else {
        this.veryhappy_label = "eryhappy";
        this.happy_label = "happy";
        this.normal_label = "normal";
        this.sad_label = "sad";
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
      }
    });
  }

}
