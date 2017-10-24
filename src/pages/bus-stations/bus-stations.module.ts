import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusStationsPage } from './bus-stations';

@NgModule({
  declarations: [
    BusStationsPage,
  ],
  imports: [
    IonicPageModule.forChild(BusStationsPage),
  ],
})
export class BusStationsPageModule {}
