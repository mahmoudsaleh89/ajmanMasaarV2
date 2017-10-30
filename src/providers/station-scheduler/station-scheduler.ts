import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class StationSchedulerProvider {
  constructor(public http: Http) {
  }

  data: any;

  load(id) {
    debugger;
    return new Promise(resolve => {
      this.http.get('http://151.253.35.253:9015/MasaarWebAPI/api/BusStop/GetStopBuses?StopId=' + id).map(res => res.json())
        .subscribe(data => {
          debugger;
          this.data = data;
          resolve(this.data);
        });

    });

  }
}
