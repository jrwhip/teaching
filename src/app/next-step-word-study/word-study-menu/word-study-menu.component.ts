import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-word-study-menu',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './word-study-menu.component.html',
    styleUrls: ['./word-study-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordStudyMenuComponent {}
