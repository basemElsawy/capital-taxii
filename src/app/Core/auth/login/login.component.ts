import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../../shared-ui/spinner/spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading: boolean = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.initialiseLoginForm();
  }

  initialiseLoginForm(): void {
    this.loginForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  doLogin(): void {
    this.isLoading = true;
    let loginBody = this.loginForm.value;
    this.authService.makeLogin(loginBody).subscribe({
      next: (res: any) => {
        let decodedToken = this.authService.tokenDecode(res.token);
        localStorage.setItem('expiryDate', decodedToken.exp);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('roles', JSON.stringify(res.roles));

        this.toastr.success(
          `Welcome, ${res.user.fullName}!`,
          'Login Successful'
        );
        this.isLoading = false;
        this.router.navigateByUrl('/home/welcome');
      },
      error: (error) => {
        this.isLoading = false;
        if (error?.error?.errors[0]?.errorEn) {
          this.toastr.error(error?.error?.errors[0]?.errorEn);
        } else {
          this.toastr.error('Error, Please try again');
        }
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
