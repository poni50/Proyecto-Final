import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
})
export class CollectionPage implements OnInit {
  collections: any;

  constructor(private navParams: NavParams, private modalController: ModalController) {
    this.collections = this.navParams.get("collections");
   }

  ngOnInit() {

    console.log(this.collections);
    

  }

  dismiss() {
    this.modalController.dismiss();
  }
}
