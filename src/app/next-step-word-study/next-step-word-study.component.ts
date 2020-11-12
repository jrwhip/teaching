import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap, map, tap } from 'rxjs/operators';

import { WordService } from '../word.service';

@Component({
  selector: 'app-next-step-word-study',
  templateUrl: './next-step-word-study.component.html',
  styleUrls: ['./next-step-word-study.component.scss']
})
export class NextStepWordStudyComponent implements OnInit {
  wordGroups$: Observable<any>;
  words: string[];

  constructor(private route: ActivatedRoute, private wordService: WordService) { }

  ngOnInit(): void {
    this.wordGroups$ = this.route.params.pipe(
      tap(_ => this.words = []),
      mergeMap(({ sectionName }) => {
        console.log('sectionName: ', sectionName);
        return this.wordService.getAllWords().pipe(
          map(value => (value[sectionName]))
        );
      })
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
