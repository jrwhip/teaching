import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-math-basics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basic-math.component.html',
  styleUrl: './basic-math.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicMathComponent {
  operation: string;

  constructor(private route: ActivatedRoute) {
    this.operation = this.route.snapshot.paramMap.get('operation') ?? '';
    console.log('BasicMathComponent created');
    console.log('Operation:', this.operation);
  }
}
