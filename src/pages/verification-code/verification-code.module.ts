import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {VerificationCodePage} from './verification-code';
import {HttpClient} from "@angular/common/http";
import {createTranslateLoader} from "../../app/app.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    VerificationCodePage,
  ],
  imports: [
    IonicPageModule.forChild(VerificationCodePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class VerificationCodePageModule {
}
