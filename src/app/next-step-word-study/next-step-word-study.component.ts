import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { WordService, WordSection } from '../word.service';

import { WordStudyMenuComponent } from './word-study-menu/word-study-menu.component';
import { WordListComponent } from './word-list/word-list.component';

@Component({
    selector: 'app-next-step-word-study',
    imports: [AsyncPipe, KeyValuePipe, WordStudyMenuComponent, WordListComponent],
    templateUrl: './next-step-word-study.component.html',
    styleUrls: ['./next-step-word-study.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextStepWordStudyComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly wordService = inject(WordService);

  wordGroups$!: Observable<WordSection | undefined>;
  words!: string[];

  ngOnInit(): void {
    this.wordGroups$ = this.route.params.pipe(
      tap(() => this.words = []),
      map(({ sectionName }) => this.wordService.getSection(sectionName)),
    );
  }

  suffleWords(newWordsArr: string[]) {
    const wordsArr = this.words.concat(newWordsArr);
    wordsArr.forEach((_, i) => {
      const j = Math.floor(Math.random() * i);
      const temp = wordsArr[i];
      wordsArr[i] = wordsArr[j];
      wordsArr[j] = temp;
    });
    this.words = wordsArr;
  }

  clearWordsArr() {
    this.words = [];
  }

  randomize() {
    const wordsArr = [...this.words];
    wordsArr.forEach((_, i) => {
      const j = Math.floor(Math.random() * i);
      const temp = wordsArr[i];
      wordsArr[i] = wordsArr[j];
      wordsArr[j] = temp;
    });
    this.words = wordsArr;
  }
}
