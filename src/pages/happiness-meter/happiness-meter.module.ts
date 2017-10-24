import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HappinessMeterPage } from './happiness-meter';

@NgModule({
  declarations: [
    HappinessMeterPage,
  ],
  imports: [
    IonicPageModule.forChild(HappinessMeterPage),
  ],
})
export class HappinessMeterPageModule {}
