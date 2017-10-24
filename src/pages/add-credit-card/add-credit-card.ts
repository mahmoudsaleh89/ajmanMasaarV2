import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GeneralSettingsProvider} from "../../providers/general-settings/general-settings";
import {NgForm} from "@angular/forms";



@IonicPage()
@Component({
  selector: 'page-add-credit-card',
  templateUrl: 'add-credit-card.html',
})

export class AddCreditCardPage {
  public loading:string;
  exp:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public settings: GeneralSettingsProvider) {
    this.loading = "{display:none}";
  }


  ionViewDidLoad() {
    this.loading = "{display:none}";
  }

  do_my_click() {


  //-- Simulate a submit

  this.loading =  this.loading = "'font-size':20px";//"font-size:20px;display:inline-block;stroke:#ff0000;";


}

  onsavecard(form: NgForm) {


  this.settings.AddMasterCard(form.value.cardnum,form.value.expiry,form.value.ccv,form.value.holder).then(()=>{this.navCtrl.popTo('MyWalletPage')});


  }

  changeexp()
  {
    if(this.exp.length == 1)
    {

      if(this.exp > "1")
      {

        this.exp = "0"+this.exp;
      }

    }
    else if(this.exp.length == 2)
    {
      if( this.exp > "12")
      {
        this.exp = "";
      }
      else {
        this.exp = this.exp;
      }
    }
    else if(this.exp.length == 4)
    {

      this.exp =  this.exp.substring(0,2)+"/"+ this.exp.substring(2,2);
    }

  }

}
