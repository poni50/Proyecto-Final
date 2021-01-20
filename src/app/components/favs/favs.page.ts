import { PhotosService } from './../../services/photos.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favs',
  templateUrl: './favs.page.html',
  styleUrls: ['./favs.page.scss'],
})
export class FavsPage implements OnInit {

  likedPhotos: any[];

  constructor(private photoService: PhotosService) { }

  ngOnInit() {
    this.photoService.observableLikePhotos$.subscribe(data => this.likedPhotos = data);
  }

}
