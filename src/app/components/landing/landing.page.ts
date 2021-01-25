import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { LoginPage } from "./login/login.page";
import { RegisterPage } from "./register/register.page";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.page.html",
  styleUrls: ["./landing.page.scss"],
})
export class LandingPage implements OnInit {
  imgArray = [
    "../../../assets/fondo/bcn.jpg",
    "../../../assets/fondo/snow.jpg",
    "../../../assets/fondo/sunset.jpg",
    "../../../assets/fondo/stairs.jpg",
  ];
  imgL: string;
  isLoading: boolean;
  constructor(private http: HttpClient, private modalController: ModalController) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadImgs();
  }

  async loadImgs() {
    try {
      throw 'hahahaha';
      const imgResponse: any = await this.http.get("https://api.unsplash.com/photos/random?orientation=portrait&client_id=7leTnM2XWB-w59oqKpugx_DLVrRvT1p6wGe_uobx0zE").toPromise();
      this.imgL = imgResponse.urls.regular;
    } catch (err) {
      this.imgL = this.imgArray[
        Math.floor(Math.random() * Math.floor(this.imgArray.length))
      ];
    }
    this.isLoading = false;
  }

  async login(){
    const modal = await this.modalController.create({
      component: LoginPage,
    });

    return await modal.present();
  }

  async register(){
    const modal = await this.modalController.create({
      component: RegisterPage,
    });
    
    return await modal.present();
  }
}
