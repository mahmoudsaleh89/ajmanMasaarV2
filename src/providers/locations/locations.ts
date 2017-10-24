import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {HaversineService, GeoCoord} from "ng2-haversine";
import {Storage} from '@ionic/storage';
import {Geolocation} from '@ionic-native/geolocation';

@Injectable()
export class LocationsProvider {
  data: any;
  staticData: any;
  trips = [];
  favoritsLocation = [];

  mycurrentLocation: any;

  constructor(public http: Http,
              private _haversineService: HaversineService,
              public storage: Storage,
              public geolocation: Geolocation) {

  }

  /*  getCurrentLocation() {


      return new Promise(resolve => {
        this.geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 3000
        }).then((resp) => {
          let currnetData = {};
          currnetData = {
            lat: resp.coords.latitude,
            long: resp.coords.longitude
          }
          resolve(currnetData);

        }).catch((error) => {
          let currnetData = {
            lat: 25.405217,
            long: 55.513643
          }
          resolve(currnetData);


        });


      });

    }*/

  load(lat, long) {
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.staticData = [

        {
          "Id": "1",
          "LocationName": " محطة المصلى",
          "Description": "Al Musalla Bus Station",
          "Latitude": 25.411876,
          "Longitude": 55.446119
        },
        {
          "Id": "54",
          "LocationName": "موقف المنامة هايبر ماركت",
          "Description": "Al Manama Haybermarket Bus Stop Depo",
          "Latitude": 25.406327,
          "Longitude": 55.442449
        },
        {
          "Id": "55",
          "LocationName": "موقف الصناعية  الرئيسي",
          "Description": "Main  Industrial Area Bus Stop Depo",
          "Latitude": 25.376359,
          "Longitude": 55.477267
        },
        {
          "Id": "6",
          "LocationName": " موقف سيتي سنتر",
          "Description": "City Center Bus Stop",
          "Latitude": 25.401908,
          "Longitude": 55.478123
        },
        {
          "Id": "10",
          "LocationName": "موقف جامعة عجمان",
          "Description": "Ajman Univ. Bus Stop 1",
          "Latitude": 25.41048,
          "Longitude": 55.506287
        },
        {
          "Id": "11",
          "LocationName": "موقف جامعة عجمان",
          "Description": "Ajman Univ. Bus Stop 2",
          "Latitude": 25.410541,
          "Longitude": 55.506811
        },
        {
          "Id": "12",
          "LocationName": "موقف إدارة المرور و الدوريات",
          "Description": "Traffic Dept. Bus Stop 1",
          "Latitude": 25.412005,
          "Longitude": 55.510349
        },
        {
          "Id": "13",
          "LocationName": "موقف إدارة المرور و الدوريات",
          "Description": "Traffic Dept. Bus Stop 2",
          "Latitude": 25.410743,
          "Longitude": 55.509538
        },
        {
          "Id": "14",
          "LocationName": "موقف السوق الصيني",
          "Description": "China Mall Bus Stop 1",
          "Latitude": 25.429368,
          "Longitude": 55.521528
        },
        {
          "Id": "15",
          "LocationName": "موقف السوق الصيني",
          "Description": "China Mall Bus Stop 2",
          "Latitude": 25.42938,
          "Longitude": 55.521383
        },
        {
          "Id": "16",
          "LocationName": "موقف الجرف الصناعية",
          "Description": "Jurf Industrial Area Stop",
          "Latitude": 25.434754,
          "Longitude": 55.525054
        },
        {
          "Id": "17",
          "LocationName": "موقف المنامة هايبر ماركت",
          "Description": "Al Manama Haybermarket Bus Stop",
          "Latitude": 25.389389,
          "Longitude": 55.466084
        },
        {
          "Id": "18",
          "LocationName": "موقف أدنوك",
          "Description": "ADNOC Bus Stop 1",
          "Latitude": 25.388899,
          "Longitude": 55.460511
        },
        {
          "Id": "19",
          "LocationName": "موقف أدنوك",
          "Description": "ADNOC  Bus Stop 2",
          "Latitude": 25.389131,
          "Longitude": 55.460586
        },
        {
          "Id": "2",
          "LocationName": "موقف الإتحاد",
          "Description": "Al Ittihad Bus Stop",
          "Latitude": 25.40568,
          "Longitude": 55.444257
        },
        {
          "Id": "20",
          "LocationName": "موقف سكن البلدية",
          "Description": "Municipality housing Bus Stop",
          "Latitude": 25.392351,
          "Longitude": 55.484019
        },
        {
          "Id": "21",
          "LocationName": "1 موقف الصناعية الجديدة",
          "Description": "New Industrial Bus Stop",
          "Latitude": 25.393604,
          "Longitude": 55.482226
        },
        {
          "Id": "22",
          "LocationName": "موقف اوتليت",
          "Description": "Outlet Bus Stop",
          "Latitude": 25.392906,
          "Longitude": 55.477654
        },
        {
          "Id": "23",
          "LocationName": "موقف مركز الشرفاء",
          "Description": "Al Shorafa Center Bus Stop",
          "Latitude": 25.380652,
          "Longitude": 55.470419
        },
        {
          "Id": "24",
          "LocationName": "موقف مساحة تعليم قيادة السيارات",
          "Description": "Driving Area Bus Stop",
          "Latitude": 25.389487,
          "Longitude": 55.481582
        },
        {
          "Id": "25",
          "LocationName": "موقف الصناعية  الرئيسي",
          "Description": "Main Industrial Area Bus Stop",
          "Latitude": 25.376359,
          "Longitude": 55.477267
        },
        {
          "Id": "26",
          "LocationName": "موقف نادي عجمان",
          "Description": "Ajman Club Bus Stop 1",
          "Latitude": 25.390578,
          "Longitude": 55.449833
        },
        {
          "Id": "27",
          "LocationName": "موقف آر القابضة",
          "Description": "R Holding Bus Stop 1",
          "Latitude": 25.392648,
          "Longitude": 55.434673
        },
        {
          "Id": "28",
          "LocationName": "موقف آر القابضة",
          "Description": "R Holding Bus Stop 2",
          "Latitude": 25.392509,
          "Longitude": 55.434137
        },
        {
          "Id": "29",
          "LocationName": "موقف نادي عجمان",
          "Description": "Ajman Club Bus Stop 2",
          "Latitude": 25.39035,
          "Longitude": 55.449828
        },
        {
          "Id": "3",
          "LocationName": "موقف أبراج الراشدية 1",
          "Description": "Al RashIdiya Tower Bus Stop 1",
          "Latitude": 25.398037,
          "Longitude": 55.45124
        },
        {
          "Id": "30",
          "LocationName": "موقف شركة لوتاه",
          "Description": "Lootah Company Bus Stop",
          "Latitude": 25.384298,
          "Longitude": 55.484466
        },
        {
          "Id": "31",
          "LocationName": "موقف السوان",
          "Description": "Al Sawan Bus Stop",
          "Latitude": 25.395547,
          "Longitude": 55.440909
        },
        {
          "Id": "32",
          "LocationName": "موقف الراشدية",
          "Description": "RashIdiya Bus Stop 1",
          "Latitude": 25.399876,
          "Longitude": 55.443008
        },
        {
          "Id": "33",
          "LocationName": "موقف الراشدية",
          "Description": "RashIdiya Bus Stop 2",
          "Latitude": 25.400651,
          "Longitude": 55.443555
        },
        {
          "Id": "34",
          "LocationName": "موقف شرطة الحميدية",
          "Description": "HamIdiya Police Station Bus Stop 1",
          "Latitude": 25.39469,
          "Longitude": 55.52781
        },
        {
          "Id": "35",
          "LocationName": "موقف أدنوك المنتزي",
          "Description": "ADNOC Al Muntazi Bus Stop",
          "Latitude": 25.387424,
          "Longitude": 55.553205
        },
        {
          "Id": "36",
          "LocationName": "موقف حديقة الحميدية",
          "Description": "HumaIdiya Park Bus Stop 1",
          "Latitude": 25.378269,
          "Longitude": 55.582588
        },
        {
          "Id": "37",
          "LocationName": "موقف حديقة الحميدية",
          "Description": "HumaIdiya Park Bus Stop 2",
          "Latitude": 25.378576,
          "Longitude": 55.582556
        },
        {
          "Id": "38",
          "LocationName": "موقف شركة دارمكس",
          "Description": "Dar Mix Bus Stop",
          "Latitude": 25.381455,
          "Longitude": 55.481956
        },
        {
          "Id": "39",
          "LocationName": "موقف منطقة المدارس",
          "Description": "School Complex Bus Stop 1",
          "Latitude": 25.396005,
          "Longitude": 55.49186
        },
        {
          "Id": "4",
          "LocationName": "موقف أبراج الخور",
          "Description": "Al Khor Tower Bus Stop",
          "Latitude": 25.394845,
          "Longitude": 55.460574
        },
        {
          "Id": "40",
          "LocationName": "موقف منطقة المدارس",
          "Description": "School Complex Bus Stop 2",
          "Latitude": 25.396339,
          "Longitude": 55.492726
        },
        {
          "Id": "41",
          "LocationName": "موقف الروضة",
          "Description": "Al Rawda Bus Stop",
          "Latitude": 25.398796,
          "Longitude": 55.511125
        },
        {
          "Id": "42",
          "LocationName": "موقف دائرة التنمية الإقتصادية",
          "Description": "Economic Department Bus Stop 1",
          "Latitude": 25.397592,
          "Longitude": 55.517965
        },
        {
          "Id": "43",
          "LocationName": "موقف دائرة التنمية الإقتصادية",
          "Description": "Economic Department Bus Stop 2",
          "Latitude": 25.397729,
          "Longitude": 55.518031
        },
        {
          "Id": "44",
          "LocationName": "موقف شرطة الحميدية",
          "Description": "HamIdiya Police Station Bus Stop 2",
          "Latitude": 25.39481,
          "Longitude": 55.527936
        },
        {
          "Id": "45",
          "LocationName": "موقف الرولة",
          "Description": "Al Rolla Bus Stop",
          "Latitude": 25.359488,
          "Longitude": 55.389476
        },
        {
          "Id": "46",
          "LocationName": "محطة الجبيل",
          "Description": "Al Jubail Station",
          "Latitude": 25.349903,
          "Longitude": 55.381186
        },
        {
          "Id": "47",
          "LocationName": "موقف المنامة هايبر ماركت",
          "Description": "Al Manama Haybermarket Bus Stop",
          "Latitude": 25.406327,
          "Longitude": 55.442449
        },
        {
          "Id": "48",
          "LocationName": "محطة باصات أبوظبي",
          "Description": "Abu Dhabi Bus Station",
          "Latitude": 24.470025,
          "Longitude": 54.377834
        },
        {
          "Id": "49",
          "LocationName": "موقف إم القيوين",
          "Description": "Umm Al Quwain Bus Stop",
          "Latitude": 25.494513,
          "Longitude": 55.558527
        },
        {
          "Id": "5",
          "LocationName": "موقف وزارة العمل",
          "Description": "Ministry of Labor Bus Stop",
          "Latitude": 25.39963,
          "Longitude": 55.473864
        },
        {
          "Id": "50",
          "LocationName": "محطة باصات رأس الخيمة",
          "Description": "RAK Bus Station",
          "Latitude": 25.753817,
          "Longitude": 55.912607
        },
        {
          "Id": "51",
          "LocationName": "موقف شارع الرقة",
          "Description": "Al Riqa Bus Stop",
          "Latitude": 25.261897,
          "Longitude": 55.327247
        },
        {
          "Id": "52",
          "LocationName": "موقف محطة مترو الإتحاد",
          "Description": "Union Metro Bus Stop",
          "Latitude": 25.266653,
          "Longitude": 55.315401
        },
        {
          "Id": "53",
          "LocationName": "موقف حديقة نايف",
          "Description": "Naif Park Bus Stop",
          "Latitude": 25.272582,
          "Longitude": 55.307066
        },
        {
          "Id": "56",
          "LocationName": "موقف النعيمية",
          "Description": "Al Nuaimiya Bus Stop",
          "Latitude": 25.379269,
          "Longitude": 55.460674
        },
        {
          "Id": "57",
          "LocationName": " موقف فندق كمبنسكي",
          "Description": "Kempinski  Hotel Stop",
          "Latitude": 25.421678,
          "Longitude": 55.442608
        },
        {
          "Id": "58",
          "LocationName": " موقف فندق قصر عجمان",
          "Description": "Ajman Palace Hotel Stop",
          "Latitude": 25.415848,
          "Longitude": 55.438365
        },
        {
          "Id": "59",
          "LocationName": " موقف كورنيش عجمان 1",
          "Description": "Ajman Cornich Stop 1",
          "Latitude": 25.41235,
          "Longitude": 55.435392
        },
        {
          "Id": "60",
          "LocationName": " موقف مجمع المطاعم 1",
          "Description": "Restaurants Complex Stop 1",
          "Latitude": 25.406473,
          "Longitude": 55.431002
        },
        {
          "Id": "61",
          "LocationName": "موقف الشاطئ المفتوح 1",
          "Description": "Open Beach Stop 1",
          "Latitude": 25.401119,
          "Longitude": 55.427022
        },
        {
          "Id": "62",
          "LocationName": "موقف الشاطئ المفتوح 2",
          "Description": "Open Beach Stop 2",
          "Latitude": 25.401002,
          "Longitude": 55.427213
        },
        {
          "Id": "63",
          "LocationName": "موقف مجمع المطاعم 2",
          "Description": "Restaurants Complex  Stop 2",
          "Latitude": 25.406343,
          "Longitude": 55.431257
        },
        {
          "Id": "64",
          "LocationName": "2 موقف كورنيش عجمان",
          "Description": "Ajman Cornich Stop 2",
          "Latitude": 25.412161,
          "Longitude": 55.435636
        },
        {
          "Id": "65",
          "LocationName": "موقف غرفة التجارة",
          "Description": "Ajman Chamber Stop",
          "Latitude": 25.41664,
          "Longitude": 55.439502
        },
        {
          "Id": "66",
          "LocationName": "موقف الإتحاد 2",
          "Description": "Al Ittihad Stop 2",
          "Latitude": 25.405257,
          "Longitude": 55.444885
        },
        {
          "Id": "67",
          "LocationName": "موقف أبراج الراشدية 2",
          "Description": "Al RashIdiya Tower Stop 2",
          "Latitude": 25.396847,
          "Longitude": 55.452183
        },
        {
          "Id": "68",
          "LocationName": "موقف أبراج فالكون",
          "Description": "Falcon Tower Stop",
          "Latitude": 25.400368,
          "Longitude": 55.44985
        },
        {
          "Id": "69",
          "LocationName": "موقف أبراج عجمان ون 2",
          "Description": "Ajman One Tower Stop 2",
          "Latitude": 25.394893,
          "Longitude": 55.428458
        },
        {
          "Id": "7",
          "LocationName": "موقف مصرف عجمان",
          "Description": "Ajman Bank Bus Stop",
          "Latitude": 25.399278,
          "Longitude": 55.4763
        },
        {
          "Id": "70",
          "LocationName": "موقف أسواق عجمان 1",
          "Description": "Ajman Market Stop 1",
          "Latitude": 25.399659,
          "Longitude": 55.434078
        },
        {
          "Id": "71",
          "LocationName": "موقف أسواق عجمان 2",
          "Description": "Ajman Market Stop 2",
          "Latitude": 25.399562,
          "Longitude": 55.434267
        },
        {
          "Id": "72",
          "LocationName": "موقف أبراج عجمان ون 1",
          "Description": "Ajman One Tower Stop 1",
          "Latitude": 25.394721,
          "Longitude": 55.42859
        },
        {
          "Id": "73",
          "LocationName": "موقف الزاهر",
          "Description": "Al Zaher Stop ",
          "Latitude": 25.402864,
          "Longitude": 55.438904
        },
        {
          "Id": "74",
          "LocationName": "موقف المنامة هايبرماركت 2",
          "Description": "Manama Market Stop 2",
          "Latitude": 25.405939,
          "Longitude": 55.442374
        },
        {
          "Id": "75",
          "LocationName": "موقف ليواره",
          "Description": "Liwarah Stop",
          "Latitude": 25.420251,
          "Longitude": 55.450143
        },
        {
          "Id": "76",
          "LocationName": "موقف المبنى الرئيسي للمنطقة الحرة",
          "Description": "Ajman Free Zone HQ Stop",
          "Latitude": 25.416624,
          "Longitude": 55.452883
        },
        {
          "Id": "77",
          "LocationName": "موقف مستودعات المنطقة الحرة",
          "Description": "Ajman Free Zone WH Stop",
          "Latitude": 25.413204,
          "Longitude": 55.452666
        },
        {
          "Id": "78",
          "LocationName": "1 موقف مستودعات المنطقة الحرة",
          "Description": "Ajman Free Zone WH Stop 1",
          "Latitude": 25.411214,
          "Longitude": 55.452018
        },
        {
          "Id": "79",
          "LocationName": "موقف أبراج أورينت",
          "Description": "Oriant Tower Stop",
          "Latitude": 25.405847,
          "Longitude": 55.451487
        },
        {
          "Id": "8",
          "LocationName": "موقف مستشفى الشيخ خليفة",
          "Description": "Khalifa Hosp. Bus Stop 1",
          "Latitude": 25.414696,
          "Longitude": 55.496882
        },
        {
          "Id": "80",
          "LocationName": "موقف سيتي لايف",
          "Description": "City Life Stop",
          "Latitude": 25.398474,
          "Longitude": 55.45356
        },
        {
          "Id": "81",
          "LocationName": "موقف سوق السمك",
          "Description": "Fish Market Stop",
          "Latitude": 25.39942,
          "Longitude": 55.453144
        },
        {
          "Id": "82",
          "LocationName": "موقف أبراج هورايزون",
          "Description": "Horizen Tower Stop",
          "Latitude": 25.394399,
          "Longitude": 55.456015
        },
        {
          "Id": "83",
          "LocationName": "موقف مارينا عجمان 2",
          "Description": "Ajman Marina Stop 2",
          "Latitude": 25.418584,
          "Longitude": 55.445248
        },
        {
          "Id": "84",
          "LocationName": " موقف مارينا عجمان 1",
          "Description": "Ajman Marina Stop1",
          "Latitude": 25.420497,
          "Longitude": 55.44916
        },
        {
          "Id": "85",
          "LocationName": "موقف شويترام",
          "Description": "Cheitram Stop",
          "Latitude": 25.410427,
          "Longitude": 55.44363
        },
        {
          "Id": "86",
          "LocationName": "محطة الرولة",
          "Description": "Al Rolla Bus Station",
          "Latitude": 25.356686,
          "Longitude": 55.389173
        },
        {
          "Id": "87",
          "LocationName": "موقف محيصنة 1",
          "Description": "Muhaisnah 1 Stop",
          "Latitude": 25.252091,
          "Longitude": 55.411271
        },
        {
          "Id": "88",
          "LocationName": "موقف مترو الراشدية",
          "Description": "RashIdiya Metro Station Stop",
          "Latitude": 25.23005,
          "Longitude": 55.390915
        },
        {
          "Id": "9",
          "LocationName": "موقف مستشفى الشيخ خليفة",
          "Description": "Khalifa Hosp. Bus Stop 2",
          "Latitude": 25.414695,
          "Longitude": 55.497197
        }
      ];
      this.staticData = this.tryHaversine(this.staticData, lat, long);
      this.staticData.sort((locationA, locationB) => {
        return locationA.distance - locationB.distance;
      });

      resolve(this.staticData);

      /*this.http.get('http://151.253.35.253:9015/MasaarWebAPI/api/BusStop/GetBusStations').map(res => res.json())
        .subscribe(data => {
          this.data = this.tryHaversine(data, lat, long);
          this.data.sort((locationA, locationB) => {
            return locationA.distance - locationB.distance;
          });
          resolve(this.data);
        }, (err) => {
          this.staticData = [{name: 'shit', id: '22'}];
          resolve(this.staticData);
        });*/

    });
  }

  tryHaversine(locations, lat, long): void {
    let usersLocation: GeoCoord = {
      latitude: 0,
      longitude: 0
    };
    if (lat == '' || long == '') {
      usersLocation.latitude = 25.396005;
      usersLocation.longitude = 55.491860
    } else {
      usersLocation.latitude = lat;
      usersLocation.longitude = long;
    }

    locations.map((location) => {
      let placeLocation: GeoCoord = {
        latitude: location.Latitude,
        longitude: location.Longitude
      };
      location.distance = this._haversineService.getDistanceInKilometers(usersLocation, placeLocation).toFixed(2);
    });
    return locations;

  }

  loadTrips() {
    return new Promise(resolve => {
      this.storage.get('trips').then((result) => {
        if (result) {
          this.trips = result;
        }
      });
      resolve(this.trips);
    });
  }

  addToRecentPlace() {
  }


  addToFavorits(location) {

    console.log(location);
    this.storage.get('favLocation').then((res) => {
      if (res) {

        this.favoritsLocation = res;
        if (location.place != '') {

          if (this.favoritsLocation.indexOf(location.place) == -1) {
            this.favoritsLocation.push(location.place);
            this.storage.set('favLocation', this.favoritsLocation);
          } else {
            /*remove from fav*/
            console.log(this.favoritsLocation.indexOf(location.place));
            return;
          }
        } else {
          console.log('not saved ')
          return;
        }
      } else {

        if (location.place != '') {

          this.favoritsLocation = [];
          this.favoritsLocation.push(location.place);
          this.storage.set('favLocation', this.favoritsLocation)
        }
      }
    });
  }

  removeFromFavorits(location) {
    let postion = this.favoritsLocation.indexOf(location.place);
    this.favoritsLocation.splice(postion, 1);
    this.storage.set('favLocation', this.favoritsLocation);
    this.getToFavorits();
  }

  removeFromHistory(location) {

    let postionTrip = -1;

    for (let i = 0; i < this.trips.length; i++) {

      if (this.trips[i].from == location.from && this.trips[i].to == location.to) {
        postionTrip = i;
      }
    }
    if (postionTrip != -1) {
      this.trips.splice(postionTrip, 1);
      this.storage.set('trips', this.trips);
    }


  }


  getToFavorits() {
    return new Promise(resolve => {
      this.storage.get('favLocation').then((res) => {
        this.favoritsLocation = res;
      });
      return resolve(this.favoritsLocation);
    });
  }

}
