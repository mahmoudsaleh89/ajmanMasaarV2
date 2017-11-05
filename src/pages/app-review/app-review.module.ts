import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AppReviewPage} from './app-review';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    AppReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(AppReviewPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class AppReviewPageModule {
}
