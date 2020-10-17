import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss']
})
export class WordListComponent implements OnInit {
  @Input() words: any;

  constructor() { }

  ngOnInit(): void {
  }

}
