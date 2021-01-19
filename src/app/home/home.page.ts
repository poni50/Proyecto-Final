import { PhotoPage } from "./../components/photo/photo.page";
import { ModalController } from "@ionic/angular";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
declare var require: any;
@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  postsList: any = [];
  isLoading = true;
  pageNumber: number = 1;
  likedPhotos: any = [];

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private auth: AuthService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.loadImgs();
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

    this.isLoading = false;
  }
  logout() {
    this.auth.logout();
    this.router.navigate(["/landing"]);
  }

  likeImage(id: string) {
    this.postsList = this.postsList.map((e) => {
      if (e.id == id) {
        if (e.liked) {
          e.liked = !e.liked;
          if (e.liked == true) {
            this.likedPhotos = this.addPhoto(e, this.likedPhotos);
          }
        } else {
          e = { ...e, liked: true };
        }
      }
      return e;
    });
  }
  addPhoto(image: any, array: any[]) {
    if (array.findIndex((e) => e.id == image.id) < 0) {
      return [...array, image];
    } else {
      return array;
    }
  }

  async showMore() {
    this.pageNumber++;
    const imgArray: any = await this.http
      .get(
        `https://api.unsplash.com/photos/?page=${this.pageNumber}&client_id=7leTnM2XWB-w59oqKpugx_DLVrRvT1p6wGe_uobx0zE`
      )
      .toPromise();
    imgArray.forEach((e) => {
      this.postsList.findIndex((el) => el.id == e.id) < 0
        ? this.postsList.push(e)
        : null;
    });
  }

  async openImageModal(image: any) {
    const modal = await this.modalController.create({
      component: PhotoPage,
      componentProps: { imageData: image },
    });
    modal.onDidDismiss().then((data: any) => {
      this.postsList.map((e) => (e.id == data.id ? (e = data) : e));
    });

    return await modal.present();
  }
}
