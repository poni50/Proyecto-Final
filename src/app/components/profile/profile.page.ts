import { ToastController } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "./../../services/auth.service";
import { PhotosService } from "./../../services/photos.service";
import { Component, OnInit } from "@angular/core";
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory,CameraPhoto, CameraSource } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

const { Camera, Filesystem, Storage } = Plugins;

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  user: any;
  userInfo: any;
  defaultAvatar = '../../../assets/avatar.png';
  edit = false;
  private PHOTO_STORAGE: string = "photo";
  fg: FormGroup;
  strings = '';
  errorTrace = '';
  

  constructor(private photoService: PhotosService, private auth: AuthService, private router: Router, private platform: Platform, private formBuilder: FormBuilder,
    private toastCtrl: ToastController) {
    this.platform = platform;
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.user = await this.auth.getUserInfo().toPromise();    
    
    if (!this.photoService.userInfo) {
      this.photoService.isLoading = this.photoService.loadImages(this.user.uid);
    }
    this.photoService.observableUserInfo$.subscribe((data) => {              
      this.userInfo = data;
      if(this.userInfo.avatar != null){
          this.loadImageStorage(this.userInfo.avatar).then((data) => this.userInfo.avatar.webviewPath = data);  
      }
    });    
  }

  // Leer la imagen desde el disco duro en memoria
  async loadImageStorage(photo){
    if(!this.platform.is("hybrid")){
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: FilesystemDirectory.Data
      });
  
      // Web platform only: Load the photo as base64 data
      return `data:image/jpeg;base64,${readFile.data}`;
    }

    return photo.webviewPath;
  }

  editProfile(){    
    this.edit = !this.edit;  

    this.fg = this.formBuilder.group(
      {       
        username: [this.userInfo?.username, [Validators.required, Validators.minLength(6)]],        
      }
    );      
  }

  async sendData(){    
    this.userInfo.username = this.fg.get('username').value;   
    this.photoService.updateUser(this.userInfo);
    let toast = await this.toastCtrl.create({
      message: 'Update succesfully',
      duration: 3000,
      position: 'bottom'
    });

    this.edit = false;
    
    toast.present();
  }

  async setPhoto(gallery: boolean) {
      //this.userInfo.avatar = await this.addNewToGallery();
      await this.addNewToGallery(gallery);
      this.photoService.updateUser(this.userInfo);
  }

// userInfo?.avatar ? userInfo.avatar.webviewPath : defaultAvatar
  public async addNewToGallery(gallery: boolean) {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      source: gallery ? CameraSource.Photos : CameraSource.Camera, // automatically take a new photo with the camera
      quality: 100 // highest quality (0 to 100)
    });

    // Save the picture and add it to photo collection
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.userInfo.avatar = savedImageFile;
    this.strings += 'succ';
  }

  private async savePicture(cameraPhoto: CameraPhoto) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath
      };
    }
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: cameraPhoto.path
      });
  
      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(cameraPhoto.webPath);
      const blob = await response.blob();
  
      return await this.convertBlobToBase64(blob) as string;
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

  logout() {
    this.auth.logout();
    this.router.navigate(["/landing"]);
  }
}
