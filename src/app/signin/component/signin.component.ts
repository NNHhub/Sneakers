import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
  ],
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
    private router: Router
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
    localStorage.setItem('token','a9sd932lDS032dfjreisadfi20002cdddsDDssd')
    this.loginForm.controls['password'].reset();
    setTimeout(() => {
      this.buttonLock = false;
    }, 2000);
  }
}