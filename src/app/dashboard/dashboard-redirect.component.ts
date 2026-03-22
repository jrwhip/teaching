import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';

@Component({
  standalone: true,
  template: `
    <div class="section text-center">
      <span class="spinner"></span>
    </div>
  `,
})
export default class DashboardRedirectComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    const role = this.auth.userRole();
    switch (role) {
      case 'TEACHER':
        this.router.navigate(['/dashboard/teacher'], { replaceUrl: true });
        break;
      case 'PARENT':
        this.router.navigate(['/dashboard/parent'], { replaceUrl: true });
        break;
      case 'STUDENT':
        this.router.navigate(['/dashboard/student'], { replaceUrl: true });
        break;
      default:
        this.router.navigate(['/login'], { replaceUrl: true });
    }
  }
}
