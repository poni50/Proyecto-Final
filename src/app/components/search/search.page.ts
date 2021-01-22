import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { PhotoPage } from "../photo/photo.page";
import { Storage } from "@ionic/storage";
import { PhotosService } from "src/app/services/photos.service";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"],
})
export class SearchPage implements OnInit {
  filteredPhotos = [];
  likedPhotos: any[];
  search: any;
  pageNumber: number = 1;
  timeOutId: any;
  isLoadingImg: boolean = true;
  isLoading = false;

  constructor(
    private modalController: ModalController,
    private storage: Storage,
    private photoService: PhotosService,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  finishLoading(){
    this.isLoadingImg = !this.isLoadingImg;
  }

  async loadData(){
    if(!this.photoService.userInfo){
      const user = await this.auth.getUserInfo().toPromise();
      this.photoService.isLoading = this.photoService.loadImages(user.uid);
    }

    this.photoService.observableUserInfo$.subscribe(
      e => {
        this.likedPhotos = e.likedPhotos;
        //this.collections = e.collections;
        this.photoService.checkLikes(this.filteredPhotos);
    });
    this.router.events.subscribe( () => this.photoService.checkLikes(this.filteredPhotos));
  }

  searchPhoto(searchName) {
    this.search = searchName.value.trim();
    console.log(this.search);
    
    this.search.replaceAll(' ', '-');

    this.timeOutId ? clearTimeout(this.timeOutId): null;
    this.timeOutId =  setTimeout(()=>{
      this.loadSearchImages();
      this.search = '';
    },2000);
    
  }

  async showMore() {
    this.isLoading = true;
    this.pageNumber++;
    let imgArray: any = await this.photoService.searchPhotos(
      `https://api.unsplash.com/search/photos/?query=${this.search}&page=${this.pageNumber}&client_id=7leTnM2XWB-w59oqKpugx_DLVrRvT1p6wGe_uobx0zE`
    );
    imgArray.forEach((e) => {
      this.filteredPhotos = this.photoService.addPhoto(e, this.filteredPhotos);
    });
    this.isLoading = false;
  }

  async loadSearchImages(){
    this.pageNumber = 1;
    this.filteredPhotos = await this.photoService.searchPhotos(
      `https://api.unsplash.com/search/photos/?query=${this.search}&page=${this.pageNumber}&client_id=7leTnM2XWB-w59oqKpugx_DLVrRvT1p6wGe_uobx0zE`
    )
    console.log("RESULT", this.filteredPhotos);
  }

  async openImageModal(image: any) {
    const modal = await this.modalController.create({
      component: PhotoPage,
      componentProps: { imageData: image},
    });
    modal.onDidDismiss().then((data: any) => {
      this.filteredPhotos = this.photoService.onModalDismiss(
        data.data,
        this.filteredPhotos
      );
    });

    return await modal.present();
  }

  likeImage(image: any) {
    this.filteredPhotos = this.photoService.likeImage(image, this.filteredPhotos);
  }


}
