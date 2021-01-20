import { PhotosService } from './../services/photos.service';
import { PhotoPage } from "./../components/photo/photo.page";
import { ModalController } from "@ionic/angular";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  postsList: any = [];
  isLoading = true;
  pageNumber: number = 1;
  likedPhotos: any[];
  

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private modalController: ModalController,
    private storage: Storage,
    private photoService: PhotosService
  ) {}

  ngOnInit(): void {
    this.loadImgs();
    this.photoService.observableLikePhotos$.subscribe(e => this.likedPhotos = e);
    //this.storage.get('likedPhotos').then(data => data ? this.likedPhotos = data : this.likedPhotos = []).catch(err => this.likedPhotos = []);
  }

  async loadImgs() {
   this.postsList = await this.photoService.getPhotos("https://api.unsplash.com/photos/?client_id=7leTnM2XWB-w59oqKpugx_DLVrRvT1p6wGe_uobx0zE"); 
    this.isLoading = false;
  }

  async showMore() {
    this.pageNumber++;
    let imgArray: any = await this.photoService.getPhotos(`https://api.unsplash.com/photos/?page=${this.pageNumber}&client_id=7leTnM2XWB-w59oqKpugx_DLVrRvT1p6wGe_uobx0zE`);    
    imgArray.forEach((e) => {
      this.postsList = this.photoService.addPhoto(e, this.postsList);
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(["/landing"]);
  }

  likeImage(image: any) {
    this.postsList = this.photoService.likeImage(image, this.postsList);
  }

  /*checkLikes(arr: any[]){
    return arr.map(post => {
      if (this.likedPhotos.findIndex(like => like.id == post.id) >= 0){
        post = {...post, liked: true}
      }

      return post;
    })
  }*/

  /*addPhoto(image: any, arr: any[]) {
    if (arr.findIndex((e) => e.id == image.id) < 0) {
      arr = [...arr, image];
    }
    return arr;
  }

  removePhoto(image: any, arr: any[]){
    return arr.filter( e => e.id != image.id);
  }*/

  async openImageModal(image: any) {
    const modal = await this.modalController.create({
      component: PhotoPage,
      componentProps: { imageData: image },
    });
    modal.onDidDismiss().then((data: any) => {
      this.postsList = this.photoService.onModalDismiss(data.data, this.postsList);
    });

    return await modal.present();
  }
}
