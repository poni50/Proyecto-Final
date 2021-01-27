import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "./../../services/auth.service";
import { PhotosService } from "./../../services/photos.service";
import { Component, OnInit } from "@angular/core";
import {
  Plugins,
  CameraResultType,
  Capacitor,
  FilesystemDirectory,
  CameraPhoto,
  CameraSource,
  Filesystem,
  Camera,
} from "@capacitor/core";
import { Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

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
  photo: any;
  private PHOTO_STORAGE: string = "photo";
  fg: FormGroup;

  constructor(private photoService: PhotosService, private auth: AuthService, private router: Router, private platform: Platform, private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer) {
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
      console.log("USER", this.userInfo);
      console.log("AVATAR", this.userInfo.avatar);
      if(this.userInfo.avatar){
        console.log("ENTERED IF");
        this.loadImageStorage(this.userInfo.avatar).then((data) => this.userInfo.avatar.webviewPath = data);
      }
    });    
  }

  // Leer la imagen desde el disco duro en memoria
  async loadImageStorage(photo){
    console.log("PHOTO", photo);
    
    const readFile = await Filesystem.readFile({
      path: photo.filepath,
      directory: FilesystemDirectory.Data
    });

    // Web platform only: Load the photo as base64 data
    return `data:image/jpeg;base64,${readFile.data}`;
  }

  editProfile(){    
    this.edit = !this.edit;  

    this.fg = this.formBuilder.group(
      {       
        username: [this.userInfo?.username, [Validators.required, Validators.minLength(6)]],        
      }
    );      
  }

  sendData(){    
    this.userInfo.username = this.fg.get('username').value;   
    if(this.photo){            
      this.userInfo.avatar = this.photo;    
    }  
    this.photoService.updateUser(this.userInfo);
    this.edit = false;
  }

  addPhotoToGallery() {
    this.addNewToGallery().then((data) => {
      this.photo = data;
    });
  }

  async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
       resultType: CameraResultType.Uri,
       source: CameraSource.Camera,
       quality: 100
     });
     const savedImageFile = await this.savePicture(capturedPhoto);
     
     return savedImageFile;
  }

  private async savePicture(cameraPhoto: CameraPhoto) {   
    const base64Data = await this.readAsBase64(cameraPhoto);
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });
    console.log(this.platform);
    if (this.platform.is('hybrid')) {     
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath
      };
    }
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
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
