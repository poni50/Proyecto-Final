import { AuthService } from './../../services/auth.service';
import { ModalController } from '@ionic/angular';
import { PhotosService } from './../../services/photos.service';
import { Component, OnInit } from '@angular/core';
import { PhotoPage } from '../photo/photo.page';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-favs',
  templateUrl: './favs.page.html',
  styleUrls: ['./favs.page.scss'],
})
export class FavsPage implements OnInit {

  likedPhotos: any[];
  collections: any[];
  constructor(private photoService: PhotosService, private modalController: ModalController, private auth: AuthService, private alertController: AlertController) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData(){
    if(!this.photoService.userInfo){
      const user = await this.auth.getUserInfo().toPromise();
      this.photoService.isLoading = this.photoService.loadImages(user.uid);
    }

    this.photoService.observableUserInfo$.subscribe(data => {
      this.likedPhotos = data.likedPhotos;
      this.collections = data.collections;
    });
  }

  async openImageModal(image: any) {
    const modal = await this.modalController.create({
      component: PhotoPage,
      componentProps: { imageData: image, collections: this.collections },
    });
    modal.onDidDismiss().then((data: any) => {
        this.photoService.onModalDislike(data.data);
    });

    return await modal.present();
  }

  async createCollectionAlert() {
    const alert = await this.alertController.create({
      cssClass: 'collectionAlert',
      header: 'Add a collection',
      inputs: [
        {
          name: 'nameCollection',
          type: 'text',
          placeholder: 'Name of the collection'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {            
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            const createColl = this.photoService.createCollection(data.nameCollection);            
            if(!createColl){
              console.log('No lo ha creado');            
            }
          }
        }
      ]
    });

    await alert.present();
  }


}
