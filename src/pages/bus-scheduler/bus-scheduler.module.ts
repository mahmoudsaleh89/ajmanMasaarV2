import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BusSchedulerPage} from './bus-scheduler';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    BusSchedulerPage,
  ],
  imports: [
    IonicPageModule.forChild(BusSchedulerPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class BusSchedulerPageModule {
}
