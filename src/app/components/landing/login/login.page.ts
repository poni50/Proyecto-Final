import { AuthService } from "./../../../services/auth.service";
import { ModalController } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  fg: FormGroup;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fg = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  login() {
    this.auth
      .login(this.fg.get("email").value, this.fg.get("password").value)
      .then(() => {
        this.router.navigate(["/tabs/home"]);
        this.dismiss();
      });
    //.catch(err => this.snackBar.open(err.message,'Dismiss',{duration: 3000}));
  }
}
