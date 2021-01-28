import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectHome = () => redirectLoggedInTo(['/tabs/home']);
const redirectLanding = () => redirectUnauthorizedTo(['/landing']);

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    data: { authGuardPipe: redirectLanding}
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLanding}
  },
  {
    path: 'landing',
    loadChildren: () => import('./components/landing/landing.module').then( m => m.LandingPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectHome}
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
