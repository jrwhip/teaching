import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordService {

  private _allWords: any = {
    'mixed-short': {
      a: ['hat', 'black', 'cat', 'clap', 'had', 'has', 'glad', 'mad', 'map', 'ran', 'snack', 'that'],
      i: ['pig', 'hit', 'his', 'kid', 'lip', 'sick', 'ship', 'this', 'win', 'with'],
      o: [],
      e: [],
      u: []
    },
    'core-a': {
      a_: ['hat', 'back', 'bag', 'band'],
      a_e: ['cake', 'bake', 'base', 'brave', 'chase'],
      ar: ['farm', 'arm', 'art', 'bark', 'barn', 'car'],
      ai: ['rain', 'braid', 'brain', 'drain', 'mail', 'paid']
    },
    'core-i': {
      i_: ['pig', 'big'],
      i_e: ['bike', 'bite'],
      ir: ['girl', 'birch'],
      igh: ['night', 'bright']
    },
    'core-o': {
      o_: ['mom', 'chop'],
      o_e: ['rope', 'bone'],
      or: ['fork', 'born'],
      oa: ['coal', 'coach']
    }
  }

  constructor() { }

  public getAllWords(): Observable<any> {
    return of(this._allWords);
  }
}
