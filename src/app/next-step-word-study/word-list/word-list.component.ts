
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    imports: [],
    selector: 'app-word-list',
    templateUrl: './word-list.component.html',
    styleUrls: ['./word-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordListComponent {
  @Input() words: string[] = [];
}
