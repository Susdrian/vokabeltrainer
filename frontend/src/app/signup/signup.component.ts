import {Component} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {UserOut} from "../../models/userOut.model";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    NgClass,
    NgOptimizedImage
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  submitted: any;
  model: UserOut = {id: 0, username: '', password: '', registrationdate: new Date(), lastlogin: new Date()};
  hidePassword = true;
  signupForm: FormGroup;

  constructor(private userservice: UserService, private router: Router) {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25), Validators.pattern('[A-Za-z0-9_]+')]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
      passwordRepeat: new FormControl('')
    }, {validators: this.passwordMatchValidator});
  }

  get username() {
    return this.signupForm.get('username');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get passwordRepeat() {
    return this.signupForm.get('passwordRepeat');
  }

  async signUp() {
    this.userservice.createUser(this.username?.value, this.password?.value).subscribe({
      next: () => {
        console.log('Signup successful');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.gibtschon = true;
      }
    });
  }


  passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const password = control.get('password');
    const passwordRepeat = control.get("passwordRepeat");

    return password && passwordRepeat && password.value !== passwordRepeat.value ? { passwordMismatch: true } : null;
  };
  gibtschon: boolean = false;

  get isUsernameInvalid() {
    const control = this.username;
    return control && control.invalid && (control.dirty || control.touched);
  }

  get isPasswordInvalid() {
    const control = this.password;
    return control && control.invalid && (control.dirty || control.touched);
  }

  get isPassword2Invalid() {
    const control = this.signupForm.get('passwordRepeat');
    return control && (control.invalid || this.signupForm.errors?.['passwordMismatch']) && (control.dirty || control.touched);
  }


}
