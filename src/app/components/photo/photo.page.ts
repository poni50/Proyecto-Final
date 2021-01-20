import { Component, OnInit } from "@angular/core";
import { NavParams, ModalController } from "@ionic/angular";

@Component({
  selector: "app-photo",
  templateUrl: "./photo.page.html",
  styleUrls: ["./photo.page.scss"],
})
export class PhotoPage implements OnInit {
  imageData: any;
  constructor(
    private navParams: NavParams,
    private modalController: ModalController
  ) {
    this.imageData = this.navParams.get("imageData");
  }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss(this.imageData);
  }

  liked() {
    if (this.imageData.liked == true) {
      this.imageData.liked = false;
    } else {
      this.imageData = { ...this.imageData, liked: true };
    }
  }
}
