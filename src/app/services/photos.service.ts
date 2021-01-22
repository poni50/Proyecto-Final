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
    this.userInfo.collections = this.userInfo.collections.map((collection) => {
      collection.photos = [];
      this.userInfo.likedPhotos.forEach((photo) =>{
        if(photo.collection == collection.name){
          collection.photos.push(photo);
          console.log("PUSH");
        }
      });
      console.log(collection);
      return collection
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
      const photoData = this.userInfo.likedPhotos.find((like) => like.id == post.id);
      if (photoData) {
        console.log(photoData);
        post = photoData;
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
        this.updateLikes(e);
      }
      return e;
    });
    return arr;
  }

  onModalDismiss(image: any, arr: any[]) {
    arr = arr.map((e) => {
      if (e.id == image.id) {
        e = image;
        this.updateLikes(e);
      }
      return e;
    });
    return arr;
  }

  onCollectionDismiss(image: any, colName: string) {
    this.userInfo.likedPhotos.forEach((e) => {
      if (e.id == image.id) {
        e = image;
        this.updateLikes(e);
      }
      return e;
    });
    return this.userInfo.collections.find((e) => e.name == colName).photos;
  }

  updateLikes(image: any){
    this.userInfo.likedPhotos = image.liked ? this.addPhoto(image, this.userInfo.likedPhotos): this.removePhoto(image, this.userInfo.likedPhotos);
    this.addToCollection();
    this.observableUserInfo$.next(this.userInfo);   
  }

  deleteCollection(name: string){
    this.userInfo.collections = this.userInfo.collections.filter(e => e.name != name);
    this.userInfo.likedPhotos = this.userInfo.likedPhotos.map(image => {
      if (image.collection == name){
        image.collection = '';
      }
      return image;
    });
    console.log(this.userInfo);
    this.observableUserInfo$.next(this.userInfo);
  }

  addPhoto(image: any, arr: any[]) {
    const imgIndex = arr.findIndex((e) => e.id == image.id);
    if (imgIndex < 0) {
      arr = [...arr, image];
    } else {
      arr[imgIndex] = image;
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
