import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) { }

  logout(){
    return this.auth.signOut();
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }
  
  register(email: string, password: string): Promise<any> {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  getUserInfo(){
    return this.auth.authState.pipe(first());

  }
}
