import { Component, OnInit } from "@angular/core";
import { NavParams, ModalController } from "@ionic/angular";
import { PhotosService } from "src/app/services/photos.service";

@Component({
  selector: "app-photo",
  templateUrl: "./photo.page.html",
  styleUrls: ["./photo.page.scss"],
})
export class PhotoPage implements OnInit {
  imageData: any;
  isLoadingImg: boolean = true;
  collections: any[];

  constructor(
    private navParams: NavParams,
    private modalController: ModalController, private photoService: PhotosService
  ) {
    this.imageData = this.navParams.get("imageData");
  }

  ngOnInit() {
    this.photoService.observableUserInfo$.subscribe(data => this.collections = data.collections);
  }

  dismiss() {
    this.modalController.dismiss(this.imageData);
  }

  finishLoading(){
    this.isLoadingImg = !this.isLoadingImg;
  }

  liked() {
    if (this.imageData.liked == true) {
      this.imageData.liked = false;
    } else {
      this.imageData = { ...this.imageData, liked: true };
    }
    this.updateLikes(this.imageData);
  }
  addPhotoToCollection(collectionName){
    this.imageData = {...this.imageData, collection: collectionName.value};
    this.updateLikes(this.imageData);
  }

  updateLikes(image){
    this.photoService.updateLikes(image);
  }
}
