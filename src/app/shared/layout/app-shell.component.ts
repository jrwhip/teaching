import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar.component';

@Component({
    imports: [RouterOutlet, NavbarComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <app-navbar />
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppShellComponent {}
