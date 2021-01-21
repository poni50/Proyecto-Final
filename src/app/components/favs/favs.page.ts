import { ModalController } from '@ionic/angular';
import { PhotosService } from './../../services/photos.service';
import { Component, OnInit } from '@angular/core';
import { PhotoPage } from '../photo/photo.page';

@Component({
  selector: 'app-favs',
  templateUrl: './favs.page.html',
  styleUrls: ['./favs.page.scss'],
})
export class FavsPage implements OnInit {

  likedPhotos: any[];

  constructor(private photoService: PhotosService, private modalController: ModalController) { }

  ngOnInit() {
    this.photoService.observableUserInfo$.subscribe(data => this.likedPhotos = data.likedPhotos)
  }

  async openImageModal(image: any) {
    const modal = await this.modalController.create({
      component: PhotoPage,
      componentProps: { imageData: image },
    });
    modal.onDidDismiss().then((data: any) => {
        this.photoService.onModalDislike(data.data);
    });

    return await modal.present();
  }


}
