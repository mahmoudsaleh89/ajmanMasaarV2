import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RideLaterPage } from './ride-later';

@NgModule({
  declarations: [
    RideLaterPage,
  ],
  imports: [
    IonicPageModule.forChild(RideLaterPage),
  ],
})
export class RideLaterPageModule {}
