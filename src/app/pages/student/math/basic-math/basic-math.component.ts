import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-math-basics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basic-math.component.html',
  styleUrl: './basic-math.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicMathComponent implements OnInit {
  operation = '';

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      this.operation = params.get('operation') ?? '';
      console.log('Operation:', this.operation);
    });
  }

  ngOnInit(): void {
  }
}
