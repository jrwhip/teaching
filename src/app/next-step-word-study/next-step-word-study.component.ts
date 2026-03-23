import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { WordService } from '../word.service';

import { WordStudyMenuComponent } from './word-study-menu/word-study-menu.component';
import { WordListComponent } from './word-list/word-list.component';

@Component({
    selector: 'app-next-step-word-study',
    imports: [WordStudyMenuComponent, WordListComponent],
    templateUrl: './next-step-word-study.component.html',
    styleUrls: ['./next-step-word-study.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NextStepWordStudyComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly wordService = inject(WordService);

  private readonly sectionName = toSignal(
    this.route.params.pipe(map(p => p['sectionName'] as string | undefined)),
  );

  readonly wordGroupEntries = computed(() => {
    const name = this.sectionName();
    const groups = name ? this.wordService.getSection(name) : undefined;
    if (!groups) return [];
    return Object.entries(groups).map(([key, words]) => ({ key, words }));
  });

  readonly words = linkedSignal({
    source: this.sectionName,
    computation: () => [] as string[],
  });

  shuffleWords(newWords: string[]): void {
    const combined = [...this.words(), ...newWords];
    this.fisherYatesShuffle(combined);
    this.words.set(combined);
  }

  clearWords(): void {
    this.words.set([]);
  }

  randomize(): void {
    const shuffled = [...this.words()];
    this.fisherYatesShuffle(shuffled);
    this.words.set(shuffled);
  }

  private fisherYatesShuffle(arr: string[]): void {
    [...arr.keys()].reverse().forEach(i => {
      if (i === 0) return;
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    });
  }
}
