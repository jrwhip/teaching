import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { WordService } from '../word.service';

@Component({
  selector: 'app-next-step-word-study',
  templateUrl: './next-step-word-study.component.html',
  styleUrls: ['./next-step-word-study.component.scss']
})
export class NextStepWordStudyComponent implements OnInit {
  wordGroups$: Observable<any>;
  words: [];

  constructor(private route: ActivatedRoute, private wordService: WordService) { }

  ngOnInit(): void {
    this.wordGroups$ = this.route.params.pipe(
      mergeMap(({ sectionName }) => {
        console.log('sectionName: ', sectionName);
        return this.wordService.getAllWords().pipe(
          map(value => (value[sectionName]))
        );
      })
    );
  }

}
