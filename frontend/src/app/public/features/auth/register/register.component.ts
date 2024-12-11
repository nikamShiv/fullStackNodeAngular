import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  router=inject(Router)
  authService=inject(AuthService)
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required,Validators.email]],
    password: ['', [Validators.required,Validators.minLength(6),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    ]]
  })


  register(){
    console.log("hi")
    this.authService.register({name:this.form.value.name!,email:this.form.value.email!,password:this.form.value.password!}).subscribe({
      next:()=>{
        console.log("REGISTERED");
        this.router.navigate(['/auth/login']);
      }, error:(err)=>{
        console.log(err)
      }
    })
  }
}
