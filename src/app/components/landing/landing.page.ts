import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

 
  imgL: string;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
   // this.loadImgs();
  }

  async loadImgs() {
    const imgArray: any = await this.http.get("https://api.unsplash.com/photos/random?orientation=portrait&client_id=7leTnM2XWB-w59oqKpugx_DLVrRvT1p6wGe_uobx0zE").toPromise();
    
    this.imgL = imgArray.urls.regular;
    
  }

}
