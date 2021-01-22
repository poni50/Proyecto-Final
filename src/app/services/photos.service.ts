import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

interface PhotoCollection {
  name: string;
  photos: any[];
}

interface UserInfo {
  likedPhotos?: any[];
  collections?: PhotoCollection[];
}

@Injectable({
  providedIn: "root",
})
export class PhotosService {
  isLoading: any;
  private uid: string;
  userInfo: UserInfo;
  observableUserInfo$ = new BehaviorSubject<UserInfo>({});

  constructor(private http: HttpClient, private storage: Storage) {}

  async loadImages(userId: string) {
    this.uid = userId;
    const data = await this.storage.get(userId);
    this.observableUserInfo$.next(
      data ? data : { likedPhotos: [], collections: [] }
    );
    this.observableUserInfo$.subscribe((e) => {
      this.userInfo = e;
      this.storage.set(this.uid, this.userInfo);
    });
  }

  addToCollection() {
    console.log(this.userInfo.likedPhotos);
    this.userInfo.collections.forEach((collection) => {
      this.userInfo.likedPhotos.forEach((photo) =>
        photo.collection == collection.name
          ? collection.photos.push(photo)
          : null
      );
    });
    
    
  }

  async getPhotos(url) {
    let imgArray: any = await this.http.get(url).toPromise();
    imgArray = this.checkLikes(imgArray);

    return imgArray;
  }

  async checkLikes(arr: any[]) {
    await this.isLoading;
    return arr.map((post) => {
      if (
        this.userInfo.likedPhotos.findIndex((like) => like.id == post.id) >= 0
      ) {
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
        this.userInfo.likedPhotos = e.liked
          ? this.addPhoto(e, this.userInfo.likedPhotos)
          : this.removePhoto(e, this.userInfo.likedPhotos);
        this.addToCollection();
        this.observableUserInfo$.next(this.userInfo);
      }
      return e;
    });
    return arr;
  }

  onModalDismiss(image: any, arr: any[]) {
    arr = arr.map((e) => {
      if (e.id == image.id) {
        e = image;

        this.userInfo.likedPhotos = e.liked
          ? this.addPhoto(e, this.userInfo.likedPhotos)
          : this.removePhoto(e, this.userInfo.likedPhotos);
        this.addToCollection();
        this.observableUserInfo$.next(this.userInfo);
      }
      return e;
    });
    return arr;
  }

  onModalDislike(image: any) {
    if (!image.liked) {
      this.userInfo.likedPhotos = this.removePhoto(
        image,
        this.userInfo.likedPhotos
      );
    }
    this.addToCollection();
    this.observableUserInfo$.next(this.userInfo);
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

  createCollection(name: string) {
    if (this.userInfo.collections.findIndex((e) => e.name == name) < 0) {
      this.userInfo.collections.push({ name: name, photos: [] });
      this.storage.set(this.uid, this.userInfo);
      return true;
    } else {
      return false;
    }
  }
}
