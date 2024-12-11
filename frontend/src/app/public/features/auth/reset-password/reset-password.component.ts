
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
function matchPassword(): ValidatorFn {

  return (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password === confirmPassword) {
      return null;
    }

    return { mismatch: true };
  }

}
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService)
  route = inject(ActivatedRoute)
  router = inject(Router);
  token = ""
  form = this.fb.group({
    password: ['', [
      Validators.required,
      Validators.minLength(6)
    ]],
    confirmPassword: ['', [
      Validators.required,
      Validators.minLength(6),


    ]]
  }, {
    validators: matchPassword()
  });




  constructor() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token']
    })
  }

  submit() {
    this.authService.resetPassword({ token: this.token, password: this.form.value.password! }).subscribe({
      next: () => {
        console.log("reset password");
        this.router.navigate(['/auth/login'])
      },
      error: (err) => {
        if (err && err.error && err.error.message) {
          alert(err.error.message)
        }
      }
    })
  }
}
