import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-word-list',
    imports: [],
    templateUrl: './word-list.component.html',
    styleUrls: ['./word-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordListComponent {
  readonly words = input<string[]>([]);
}
