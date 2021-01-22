import { PhotosService } from "./../services/photos.service";
import { PhotoPage } from "./../components/photo/photo.page";
import { ModalController } from "@ionic/angular";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { Component, OnInit } from "@angular/core";

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
  collections: any[];
  isLoadingImg: boolean = true;

  constructor(
    private auth: AuthService,
    private router: Router,
    private modalController: ModalController,
    private photoService: PhotosService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.photoService.observableUserInfo$.subscribe(
      e => {
        this.likedPhotos = e.likedPhotos;
        this.collections = e.collections;
        this.photoService.checkLikes(this.postsList);
    });
    this.router.events.subscribe( () => this.photoService.checkLikes(this.postsList));
  }
  finishLoading(){
    this.isLoadingImg = !this.isLoadingImg;
  }

  async loadData(){
    const user = await this.auth.getUserInfo().toPromise();
    this.photoService.isLoading = this.photoService.loadImages(user.uid);
    this.postsList = await this.photoService.getPhotos(
      "https://api.unsplash.com/photos/?client_id=7leTnM2XWB-w59oqKpugx_DLVrRvT1p6wGe_uobx0zE"
    );
    this.isLoading = false;
  }

  async showMore() {
    this.pageNumber++;
    let imgArray: any = await this.photoService.getPhotos(
      `https://api.unsplash.com/photos/?page=${this.pageNumber}&client_id=7leTnM2XWB-w59oqKpugx_DLVrRvT1p6wGe_uobx0zE`
    );
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

  async openImageModal(image: any) {
    const modal = await this.modalController.create({
      component: PhotoPage,
      componentProps: { imageData: image},
    });
    modal.onDidDismiss().then((data: any) => {
      this.postsList = this.photoService.onModalDismiss(
        data.data,
        this.postsList
      );
    });

    return await modal.present();
  }
}
