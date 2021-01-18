import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LandingPageRoutingModule } from './landing-routing.module';

import { LandingPage } from './landing.page';
import { LoginPageModule } from './login/login.module';
import { RegisterPageModule } from './register/register.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LandingPageRoutingModule,
    LoginPageModule,
    RegisterPageModule,
  ],
  declarations: [LandingPage]
})
export class LandingPageModule {}
