import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Http, HttpModule} from "@angular/http";
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {Ndef, NFC} from "@ionic-native/nfc";
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {GeneralSettingsProvider} from '../providers/general-settings/general-settings';
import {Geolocation} from "@ionic-native/geolocation";
import {MyApp} from './app.component';

import {LocationsProvider} from '../providers/locations/locations';
import {HaversineService} from "ng2-haversine";
import {StationSchedulerProvider} from '../providers/station-scheduler/station-scheduler';
import {IonicStorageModule} from "@ionic/storage";
import {AccountProvider} from '../providers/account/account';
import {NativeGeocoder} from "@ionic-native/native-geocoder";
import {DatePicker} from "@ionic-native/date-picker";
import {BalanceProvider} from '../providers/balance/balance';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {EmailComposer} from "@ionic-native/email-composer";
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/lang/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule,
    IonicStorageModule.forRoot(),
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GeneralSettingsProvider,
    LocationsProvider,
    HaversineService,
    Geolocation,
    StationSchedulerProvider,
    AccountProvider,
    NativeGeocoder,
    DatePicker,
    BalanceProvider,
    NFC,
    Ndef,
    InAppBrowser,
    EmailComposer

  ]
})
export class AppModule {
}
