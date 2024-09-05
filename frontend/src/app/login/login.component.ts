import {Component} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {UserOut} from "../../models/userOut.model";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  submitted: any;

  constructor(private authService: AuthService, private router: Router) {
  }


model:UserOut ={id:0,username:'',password:'',registrationdate:new Date(),lastlogin:new Date()};
  logincheck: boolean = false;

  async login(): Promise<void> {
    this.authService.login(this.model.username, this.model.password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: () => {
        this.logincheck = true;
        this.model.password = ''
      }
    });
  }
}
