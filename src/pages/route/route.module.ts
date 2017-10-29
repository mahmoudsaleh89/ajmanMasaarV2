import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {RoutePage} from './route';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    RoutePage,
  ],
  imports: [
    IonicPageModule.forChild(RoutePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class RoutePageModule {
}
