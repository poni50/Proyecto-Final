import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FavsPage } from './favs.page';

describe('FavsPage', () => {
  let component: FavsPage;
  let fixture: ComponentFixture<FavsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FavsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
