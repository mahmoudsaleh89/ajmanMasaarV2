import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusSchedulerPage } from './bus-scheduler';

@NgModule({
  declarations: [
    BusSchedulerPage,
  ],
  imports: [
    IonicPageModule.forChild(BusSchedulerPage),
  ],
})
export class BusSchedulerPageModule {}
