import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import { WordService } from '../../word.service';

import { WordListComponent } from './word-list/word-list.component';
import { WordStudyMenuComponent } from './word-study-menu/word-study-menu.component';

@Component({
  selector: 'app-next-step-word-study',
  standalone: true,
  imports: [CommonModule, WordStudyMenuComponent, WordListComponent],
  templateUrl: './next-step-word-study.component.html',
  styleUrls: ['./next-step-word-study.component.scss'],
})
export class NextStepWordStudyComponent implements OnInit {
  wordGroups$!: Observable<any>;
  words!: string[];

  constructor(
    private route: ActivatedRoute,
    private wordService: WordService
  ) {}

  ngOnInit(): void {
    this.wordGroups$ = this.route.params.pipe(
      tap((_) => (this.words = [])),
      mergeMap(({ sectionName }) => {
        console.log('sectionName: ', sectionName);
        return this.wordService
          .getAllWords()
          .pipe(map((value) => value[sectionName]));
      })
    );
  }

  suffleWords(newWordsArr: string[] | any) {
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
