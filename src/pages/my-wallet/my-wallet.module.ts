import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MyWalletPage} from './my-wallet';
import {HttpClient} from "@angular/common/http";
import {createTranslateLoader} from "../../app/app.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    MyWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(MyWalletPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class MyWalletPageModule {
}
