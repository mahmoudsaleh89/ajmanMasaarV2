import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckMasaarCardIosPage } from './check-masaar-card-ios';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    CheckMasaarCardIosPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckMasaarCardIosPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class CheckMasaarCardIosPageModule {}
