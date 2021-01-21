import { AuthService } from './../../services/auth.service';
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
  collections: any[];
  constructor(private photoService: PhotosService, private modalController: ModalController, private auth: AuthService) { }

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


}
