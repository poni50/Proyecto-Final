import { PhotosService } from 'src/app/services/photos.service';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  fg: FormGroup;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private photoService: PhotosService
  ) {}

  ngOnInit() {
    this.fg = this.fb.group(
      {
        email: ["", [Validators.required, Validators.email]],
        username: ["", [Validators.required, Validators.minLength(6)]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        rPassword: ["", [Validators.required, Validators.minLength(6)]],
      },
      {
        validator: this.matchPassword("password", "rPassword"),
      }
    );
  }

  matchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors.passwordMismatch
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  dismiss() {
    this.modalController.dismiss();
  }

  register() {
    this.auth.register(
      this.fg.get('email').value,
      this.fg.get('password').value,
    ).then((data) => {
      this.photoService.loadImages(data.user.uid, this.fg.get('username').value);
      this.router.navigate(["/tabs/home"]);
      this.dismiss();
    });
    //.catch(err => this.snackBar.open(err.message,'Dismiss',{duration: 3000}));
  }
}
