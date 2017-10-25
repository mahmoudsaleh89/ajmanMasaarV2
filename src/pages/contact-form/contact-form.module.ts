import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ContactFormPage} from './contact-form';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    ContactFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactFormPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class ContactFormPageModule {
}
