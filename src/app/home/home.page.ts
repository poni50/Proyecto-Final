import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
declare var require: any;
@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  postsList = [];
  isLoading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    
    this.http
      .get("https://testbooru.donmai.us/posts.json")
      .toPromise()
      .then((data: any) => {
        console.log(data);
        data.forEach((element) => {
          this.postsList.push(element.large_file_url);
        });
        this.isLoading = false;
        console.log(this.postsList);
      });
        
    //this.getData();
  }

  async getData() {
    const Danbooru = require("danbooru");
    const booru = new Danbooru();

    //const posts = await booru.posts({rating: 'safe', limit:5})
    const post = booru.posts(2560676);
    console.log(post);
    const url = booru.url(post.file_url);
    this.postsList.push(url);
    console.log(url.href);
  }
}
