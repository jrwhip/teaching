
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-word-study-menu',
    imports: [RouterModule],
    templateUrl: './word-study-menu.component.html',
    styleUrls: ['./word-study-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordStudyMenuComponent {
  constructor() {
  console.log('Hello from WordStudyMenuComponent');
  }
}
