import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HappinessMeterPage} from './happiness-meter';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    HappinessMeterPage,
  ],
  imports: [
    IonicPageModule.forChild(HappinessMeterPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class HappinessMeterPageModule {
}
