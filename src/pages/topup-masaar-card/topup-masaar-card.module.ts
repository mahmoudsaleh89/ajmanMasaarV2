import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {TopupMasaarCardPage} from './topup-masaar-card';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    TopupMasaarCardPage,
  ],
  imports: [
    IonicPageModule.forChild(TopupMasaarCardPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class TopupMasaarCardPageModule {
}
