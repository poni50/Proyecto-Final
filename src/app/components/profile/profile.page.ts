import { Router } from '@angular/router';
import { AuthService } from "./../../services/auth.service";
import { PhotosService } from "./../../services/photos.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  user: any;
  userInfo: any;
  defaultAvatar = '../../../assets/avatar.png';

  constructor(private photoService: PhotosService, private auth: AuthService, private router: Router) {}

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
    });    
  }

  logout() {
    this.auth.logout();
    this.router.navigate(["/landing"]);
  }
}
