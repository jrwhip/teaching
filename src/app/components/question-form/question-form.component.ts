import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';



@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionFormComponent {
  
}
