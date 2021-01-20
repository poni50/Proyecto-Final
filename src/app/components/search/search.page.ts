import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhotoPage } from '../photo/photo.page';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  filteredPhotos: any[];
  likedPhotos: any[];
  
  constructor(private modalController: ModalController, private storage: Storage ) { }

  ngOnInit() {
    //this.storage.get('likedPhotos').then(data => data ? this.likedPhotos = data : this.likedPhotos = []).catch(err => this.likedPhotos = []);
  }

  



}
