import { AuthService } from "./../../../services/auth.service";
import { ModalController, ToastController } from "@ionic/angular";
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
    private router: Router,
    private toastCtrl: ToastController
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
      })
      .catch(async (err) => {        
       let toast = await this.toastCtrl.create({
          message: `${err.message}`,
          buttons: [
            {
              text: "Ok",
              role: "cancel",
              handler: () => {},
            },
          ],
          position: "bottom",
        });

        toast.present();
        
      });
  }
}
