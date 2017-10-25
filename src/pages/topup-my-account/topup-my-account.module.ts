import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopupMyAccountPage } from './topup-my-account';
import {HttpClient} from "@angular/common/http";
import {createTranslateLoader} from "../../app/app.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    TopupMyAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(TopupMyAccountPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class TopupMyAccountPageModule {}
