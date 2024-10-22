import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface logInterface{
  token:string
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
  ],
  providers:[HttpClient],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})

export class SigninComponent implements OnInit {

  public loginForm!: FormGroup;
  buttonLock = false;
  errorPost = new BehaviorSubject<string>('');
  buttonClicked = false;
  errorPostSubject$ = this.errorPost.asObservable();

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
  ) {}
  
  ngOnInit() {
    this.loginForm = this.fb.group({
      login: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w\d_]+@[\w\d_]+\.\w{2,7}$/),
        ],
      ],
      password: [
        '',
        [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)],
      ],
    });
    this.loginForm.valueChanges.subscribe({
      next: () => {
        if (this.errorPost.getValue()) {
          this.errorPost.next('');
          this.buttonClicked = true;
        }
      },
    });
  }

  login() {
    this.buttonLock = true;
    this.http.post(`http://localhost:3000/api/login`, { email:this.loginForm.controls['login'].value, password:this.loginForm.controls['password'].value }).subscribe({
      next:(request)=>{
        console.log('Autorizated seccesseful');
        localStorage.setItem('token',(request as logInterface).token);
        this.router.navigate(['/'])
      },
      error:(error)=>{
        console.log('Autorization error',error)
      }
    })
    this.loginForm.controls['password'].reset();
    
    setTimeout(() => {
      this.buttonLock = false;
    }, 2000);
  }
}