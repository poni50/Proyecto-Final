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
  postsList = [];
  isLoading = false;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  async loadImgs() {
    this.http
      .get(
        "https://cors-anywhere.herokuapp.com/https://safebooru.org//index.php?page=dapi&s=post&q=index&rating=safe",
        { responseType: "text" }
      )
      .toPromise()
      .then((data: any) => {
        console.log(data);
        const parse = new DOMParser();
        const document = parse.parseFromString(data, "text/xml");
        const result = document.getElementsByTagName("post");
        console.log(result);
        for (let i = 0; i < result.length; i++) {
          this.postsList.push(result[i].attributes[2].value);
        }

        this.isLoading = false;
        console.log(this.postsList);
      });
  }
}
