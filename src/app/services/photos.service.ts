import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root",
})
export class PhotosService {
  likedPhotos: any[] = [];
  observableLikePhotos$ = new BehaviorSubject<any[]>([]);
  isLoading: any;

  constructor(private http: HttpClient, private storage: Storage) {
    //this.loadImages();
    this.isLoading =  this.loadImages();
  }

  private async loadImages() {
    const data = await this.storage.get("likedPhotos");
    data ? this.observableLikePhotos$.next(data) : null;
    this.observableLikePhotos$.subscribe((e) => (this.likedPhotos = e));
  }

  async getPhotos(url) {
    let imgArray: any = await this.http.get(url).toPromise();
    imgArray = this.checkLikes(imgArray);

    return imgArray;
  }

  async checkLikes(arr: any[]) {
    await this.isLoading;
    return arr.map((post) => {
      if (this.likedPhotos.findIndex((like) => like.id == post.id) >= 0) {
        post = { ...post, liked: true };
      }

      return post;
    });
  }

  likeImage(image: any, arr: any[]) {
    arr = arr.map((e) => {
      if (e.id == image.id) {
        if (e.liked == true) {
          e.liked = false;
        } else {
          e = { ...e, liked: true };
        }
        this.observableLikePhotos$.next(
          e.liked
            ? this.addPhoto(e, this.likedPhotos)
            : this.removePhoto(e, this.likedPhotos)
        );
      }
      return e;
    });
    this.storage.set("likedPhotos", this.likedPhotos);
    return arr;
  }

  onModalDismiss(image: any, arr: any[]) {
    arr = arr.map((e) => {
      if (e.id == image.id) {
        e = image;
        this.observableLikePhotos$.next(
          e.liked
            ? this.addPhoto(e, this.likedPhotos)
            : this.removePhoto(e, this.likedPhotos)
        );
      }
      return e;
    });
    this.storage.set("likedPhotos", this.likedPhotos);
    return arr;
  }

  onModalDislike(image: any, arr: any[]){
    if(!image.liked){         
      this.observableLikePhotos$.next(this.removePhoto(image, arr));
    }
  }

  addPhoto(image: any, arr: any[]) {
    if (arr.findIndex((e) => e.id == image.id) < 0) {
      arr = [...arr, image];
    }
    return arr;
  }

  removePhoto(image: any, arr: any[]) {
    return arr.filter((e) => e.id != image.id);
  }
}
