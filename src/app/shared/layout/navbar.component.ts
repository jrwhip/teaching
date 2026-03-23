import { Component, inject, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService, ACCENT_COLORS } from '../../core/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.scrolled]="scrolled">
      <div class="container navbar-inner">
        <a routerLink="/dashboard" class="navbar-brand">
          <i class="fas fa-graduation-cap"></i>
          Teaching App
        </a>

        <button class="nav-toggle" (click)="menuOpen = !menuOpen" aria-label="Toggle navigation">
          <i class="fas" [class.fa-bars]="!menuOpen" [class.fa-times]="menuOpen"></i>
        </button>

        <ul class="nav-links" [class.open]="menuOpen" (click)="menuOpen = false">
          @switch (auth.userRole()) {
            @case ('TEACHER') {
              <li><a routerLink="/dashboard/teacher" routerLinkActive="active"><i class="fas fa-th-large"></i> Dashboard</a></li>
              <li><a routerLink="/practice" routerLinkActive="active"><i class="fas fa-pencil-alt"></i> Practice</a></li>
            }
            @case ('PARENT') {
              <li><a routerLink="/dashboard/parent" routerLinkActive="active"><i class="fas fa-th-large"></i> Dashboard</a></li>
              <li><a routerLink="/practice" routerLinkActive="active"><i class="fas fa-pencil-alt"></i> Practice</a></li>
            }
            @case ('STUDENT') {
              <li><a routerLink="/practice" routerLinkActive="active"><i class="fas fa-pencil-alt"></i> Practice</a></li>
              <li><a routerLink="/dashboard/student" routerLinkActive="active"><i class="fas fa-chart-bar"></i> My Progress</a></li>
            }
          }
        </ul>

        <div class="nav-actions">
          <!-- Accent color picker (light mode only) -->
          @if (theme.theme() === 'light') {
            <div class="dropdown accent-picker" [class.open]="accentOpen">
              <button
                class="icon-btn"
                (click)="accentOpen = !accentOpen"
                aria-label="Background color"
                [style.background]="theme.effectiveAccent() || null"
              >
                <i class="fas fa-palette"></i>
              </button>
              <div class="dropdown-menu accent-menu">
                <div class="accent-grid">
                  @for (color of accentColors; track color.value) {
                    <button
                      class="accent-swatch"
                      [class.active]="theme.accentBg() === color.value"
                      [style.background]="color.value || 'var(--bg-surface)'"
                      [title]="color.label"
                      (click)="theme.setAccent(color.value); accentOpen = false"
                    >
                      @if (!color.value) {
                        <i class="fas fa-ban" style="color: var(--gray-400);"></i>
                      }
                    </button>
                  }
                </div>
              </div>
            </div>
          }

          <div class="theme-toggle">
            <button
              [class.active]="theme.theme() === 'light'"
              (click)="theme.theme() !== 'light' && theme.toggle()"
            >
              <i class="fas fa-sun"></i>
            </button>
            <button
              [class.active]="theme.theme() === 'dark'"
              (click)="theme.theme() !== 'dark' && theme.toggle()"
            >
              <i class="fas fa-moon"></i>
            </button>
          </div>

          <div class="dropdown" [class.open]="profileOpen">
            <button class="icon-btn" (click)="profileOpen = !profileOpen" aria-label="Profile menu">
              <i class="fas fa-user"></i>
            </button>
            <div class="dropdown-menu">
              <div style="padding: .5rem .85rem .75rem;">
                <div class="fw-bold text-heading text-sm">{{ auth.userProfile()?.displayName }}</div>
                <div class="text-xs text-muted">{{ auth.userProfile()?.email }}</div>
                <span class="pill pill-info mt-1">{{ auth.userRole() }}</span>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" (click)="onSignOut()">
                <i class="fas fa-sign-out-alt" style="margin-right: .5rem;"></i> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .accent-picker .accent-menu {
      padding: .5rem;
      min-width: auto;
      width: 196px;
    }

    .accent-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 4px;
    }

    .accent-swatch {
      width: 32px;
      height: 32px;
      border-radius: var(--radius);
      border: 2px solid var(--border-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color var(--ease), transform var(--ease);

      &:hover {
        border-color: var(--color-primary);
        transform: scale(1.1);
      }

      &.active {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), .3);
      }
    }
  `],
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  readonly accentColors = ACCENT_COLORS;

  scrolled = false;
  menuOpen = false;
  profileOpen = false;
  accentOpen = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 10;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.profileOpen = false;
      this.accentOpen = false;
    }
  }

  async onSignOut(): Promise<void> {
    this.profileOpen = false;
    await this.auth.signOut();
  }
}
