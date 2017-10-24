import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopupMyAccountPage } from './topup-my-account';

@NgModule({
  declarations: [
    TopupMyAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(TopupMyAccountPage),
  ],
})
export class TopupMyAccountPageModule {}
