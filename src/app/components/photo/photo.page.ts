import { Component, OnInit } from "@angular/core";
import { NavParams, ModalController } from "@ionic/angular";

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
    private modalController: ModalController
  ) {
    this.imageData = this.navParams.get("imageData");
    this.collections = this.navParams.get("collections");
  }

  ngOnInit() {}

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
  }
  addPhotoToCollection(collectionName){
    this.imageData = {...this.imageData, collection: collectionName.value};  
  }
}
