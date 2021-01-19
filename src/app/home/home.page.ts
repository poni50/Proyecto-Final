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
    private storage: Storage
  ) {}

  ngOnInit(): void {
    this.loadImgs();
    this.storage.get('likedPhotos').then(data => data ? this.likedPhotos = data : this.likedPhotos = []).catch(err => this.likedPhotos = []);
  }

  async loadImgs() {
    const imgArray: any = await this.http
      .get(
        "https://api.unsplash.com/photos/?client_id=7leTnM2XWB-w59oqKpugx_DLVrRvT1p6wGe_uobx0zE"
      )
      .toPromise();
    imgArray.forEach((e) => {
      this.postsList.push(e);
    });
    
    this.postsList = this.checkLikes(this.postsList);
    this.isLoading = false;
  }

  async showMore() {
    this.pageNumber++;
    let imgArray: any = await this.http
      .get(
        `https://api.unsplash.com/photos/?page=${this.pageNumber}&client_id=7leTnM2XWB-w59oqKpugx_DLVrRvT1p6wGe_uobx0zE`
      )
      .toPromise();
    
    imgArray = this.checkLikes(imgArray);
    imgArray.forEach((e) => {
      this.postsList = this.addPhoto(e, this.postsList);
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(["/landing"]);
  }

  likeImage(id: string) {
    this.postsList = this.postsList.map((e) => {
      if (e.id == id) {
        if (e.liked == true) {
          e.liked = false;
        } else {
          e = { ...e, liked: true };
        }

        this.likedPhotos = e.liked ? this.addPhoto(e, this.likedPhotos) : this.removePhoto(e, this.likedPhotos);
      }
      return e;
    });
    console.log("LIKED IMAGES", this.likedPhotos);
    this.storage.set('likedPhotos', this.likedPhotos);
  }

  checkLikes(arr: any[]){
    return arr.map(post => {
      if (this.likedPhotos.findIndex(like => like.id == post.id) >= 0){
        post = {...post, liked: true}
      }

      return post;
    })
  }

  addPhoto(image: any, arr: any[]) {
    if (arr.findIndex((e) => e.id == image.id) < 0) {
      arr = [...arr, image];
    }
    return arr;
  }

  removePhoto(image: any, arr: any[]){
    return arr.filter( e => e.id != image.id);
  }

  async openImageModal(image: any) {
    const modal = await this.modalController.create({
      component: PhotoPage,
      componentProps: { imageData: image },
    });
    modal.onDidDismiss().then((data: any) => {
      this.postsList = this.postsList.map((e) => {
        if (e.id == data.data.id) {
          e = data.data;
          this.likedPhotos = e.liked ? this.addPhoto(e, this.likedPhotos) : this.removePhoto(e, this.likedPhotos);
        }
        return e;
      });
      this.storage.set('likedPhotos', this.likedPhotos);
    });

    return await modal.present();
  }
}
