
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-word-study-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './word-study-menu.component.html',
  styleUrls: ['./word-study-menu.component.scss']
})
export class WordStudyMenuComponent {
  constructor() {
  console.log('Hello from WordStudyMenuComponent');
  }
}
