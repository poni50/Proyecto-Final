import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { PhotosService } from 'src/app/services/photos.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
})
export class CollectionPage implements OnInit {
  collection: any;

  constructor(private navParams: NavParams, private modalController: ModalController, private photoService: PhotosService, private alertController: AlertController) {
    this.collection = this.navParams.get("collection");
   }

  ngOnInit() {

    console.log(this.collection);
    

  }

  dismiss() {
    this.modalController.dismiss();
  }

  async deleteCollection(name: string){
      const alert = await this.alertController.create({
        cssClass: 'collectionAlert',
        header: 'Delete Collection',
        message: 'Are you sure want to delete this collection?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {                          
            }
          }, {
            text: 'Ok',
            handler: () => {
              this.photoService.deleteCollection(name);  
              this.dismiss();
            }
          }
        ]
      });
  
      await alert.present();
    }
    
  
}
