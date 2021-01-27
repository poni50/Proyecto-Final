import { Component, OnInit } from "@angular/core";
import { NavParams, ModalController, ToastController } from "@ionic/angular";
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
    private toastCtrl: ToastController,
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
      let toast = await this.toastCtrl.create({
        message: 'Sharing is only available on the mobile app',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  async downloadImage() {
    try{
      const response = await fetch('https://cors-anywhere.herokuapp.com/'+this.imageData.links.download+'?client_id=7leTnM2XWB-w59oqKpugx_DLVrRvT1p6wGe_uobx0zE', { 
        method: 'GET',
      });
      const image = await response.blob();

      console.log("BLOB PHOTO", image);
      
      const base64Data: any = await this.convertBlobToBase64(image) as string;
      console.log("BASE64 PHOTO", base64Data);
      const savedFile = await Filesystem.writeFile({
        path: 'Downloads/' + this.imageData.id + '.jpg',
        data: base64Data,
        directory: FilesystemDirectory.Data,
      });

      console.log(savedFile.uri);
    } catch (err){
      console.log(err);
    }
  }
}
