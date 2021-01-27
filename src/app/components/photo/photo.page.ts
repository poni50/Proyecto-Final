import { Component, OnInit } from "@angular/core";
import { NavParams, ModalController } from "@ionic/angular";
import { PhotosService } from "src/app/services/photos.service";
import { Filesystem, FilesystemDirectory, Plugins } from "@capacitor/core";
const { Share } = Plugins;
import { Platform } from "@ionic/angular";
import { NgNavigatorShareService } from 'ng-navigator-share';

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
    private modalController: ModalController,
    private photoService: PhotosService,
    private platform: Platform,
    private ngNavigatorShareService: NgNavigatorShareService
  ) {
    this.imageData = this.navParams.get("imageData");
    this.platform = platform;
  }

  ngOnInit() {
    this.photoService.observableUserInfo$.subscribe(
      (data) => (this.collections = data.collections)
    );
  }

  dismiss() {
    this.modalController.dismiss(this.imageData);
  }

  finishLoading() {
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
  addPhotoToCollection(collectionName) {
    this.imageData = { ...this.imageData, collection: collectionName.value };
    this.updateLikes(this.imageData);
  }

  updateLikes(image) {
    this.photoService.updateLikes(image);
  }

  async share() {
    if (this.platform.is("hybrid")) {
      await Share.share({
        title: "Cool image I've found",
        text: "Really awesome thing you need to see.",
        url: this.imageData.urls.full,
        dialogTitle: "Share with buddies",
      });
    } else {
      this.ngNavigatorShareService.share({
        title: 'My Awesome app',
        text: 'hey check out my Share button',
        url: 'https://developers.google.com/web'
      }).then( (response) => {
        console.log(response);
      })
      .catch( (error) => {
        console.log(error);
      });
    }
  }

  async convertBlobToBase64(blob: Blob){
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }

  async downloadImage() {
    const response = await fetch('https://cors-anywhere.herokuapp.com/'+this.imageData.links.download+'?client_id=7leTnM2XWB-w59oqKpugx_DLVrRvT1p6wGe_uobx0zE', {      
     
      method: 'GET',

    });
    const image = await response.blob();

    console.log(image);
    
    // convert to a Blob
    /*const blob = await response.blob();
    // convert to base64 data, which the Filesystem plugin requires
    const base64Data = await this.convertBlobToBase64(blob);

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data,
    });

    // helper function*/
     
  }
}
