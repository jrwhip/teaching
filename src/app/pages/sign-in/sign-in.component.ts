import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  constructor(private router: Router) {}
  login() {
    this.router.navigate(['/student', 'math']);
  }

  loginWithGoogle() {
    // ...
  }

  loginWithFacebook() {
    // ...
  }
}
