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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
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
    let loginBody = this.loginForm.value;
    this.authService.makeLogin(loginBody).subscribe({
      next: (res: any) => {
        let decodedToken = this.authService.tokenDecode(res.token);
        localStorage.setItem('expiryDate', decodedToken.exp);
        localStorage.setItem('token', res.token);
        this.toastr.success('تم تسجيل الدخول بنجاح');
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        console.log(error?.error?.errors[0]?.errorAr);
        this.toastr.error(error?.error?.errors[0]?.errorAr);
      },
    });
  }
}
