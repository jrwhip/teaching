import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MathResultsService } from './shared/math-results.service';
import { getTaxonomy } from './shared/problem-taxonomy';

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './math-menu.component.html',
  styleUrl: './math-menu.component.scss',
})
export default class MathMenuComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly results = inject(MathResultsService);

  ngOnInit(): void {
    const profile = this.auth.userProfile();
    if (profile) {
      this.results.loadStudentStats(profile.id);
    }
  }

  formatType(type: string): string {
    return getTaxonomy(type).displayLabel;
  }

  formatDate(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
}
