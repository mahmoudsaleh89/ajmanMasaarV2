import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BusStationsPage} from './bus-stations';
import {HttpClient} from "@angular/common/http";
import {createTranslateLoader} from "../../app/app.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    BusStationsPage,
  ],
  imports: [
    IonicPageModule.forChild(BusStationsPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class BusStationsPageModule {
}
