import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) { }

  logout() {
    this.auth.signOut();
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }
  
  register(email: string, password: string): Promise<any> {
    return this.auth.createUserWithEmailAndPassword(email, password);

  }
}
