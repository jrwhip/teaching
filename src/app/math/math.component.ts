import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap, map, tap } from 'rxjs/operators';

import { WordService } from '../word.service';

@Component({
  selector: 'app-next-step-word-study',
  templateUrl: './math.component.html',
})
export class MathComponent implements OnInit {
  wordGroups$: Observable<any>;
  words: string[];

  constructor(private route: ActivatedRoute, private wordService: WordService) { }

  ngOnInit(): void {
    console.log('Hello from MathComponent.ngOnInit()');
  }


}
