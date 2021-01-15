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
  postsList:any =  [];
  isLoading = true;


  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadImgs();
  }

  async loadImgs() {
    const imgArray: any = await this.http.get("https://api.unsplash.com/photos/random?count=20&client_id=7leTnM2XWB-w59oqKpugx_DLVrRvT1p6wGe_uobx0zE").toPromise();
    imgArray.forEach((e)=>{
      this.postsList.push(e);
    })
   
    
    this.isLoading = false;
  }
}
