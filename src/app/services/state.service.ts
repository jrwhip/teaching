import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  map,
  scan,
} from 'rxjs/operators';

import { CounterData, CurrentUser, State, StoredMathQuestions } from '../models/state.model';

// Initial state for the application
const initialState = new State();

/**
 * Service responsible for managing application state.
 * Provides functionality to read, update, and reset the state.
 */
@Injectable({
  providedIn: 'root',
})
export class StateService {
  // BehaviorSubject holding the application state
  protected stateSubject$: BehaviorSubject<State> = new BehaviorSubject<State>(
    initialState
  );

  /**
   * Exposes the entire state as an observable.
   * @example
   * this.stateService.state$.subscribe(state => console.log(state));
   */
  state$: Observable<State> = this.stateSubject$.asObservable();

  // Subject for updating the state with partial state updates
  private partialStateUpdate$: Subject<Partial<State>> = new Subject<
    Partial<State>
  >();

  /**
   * Observable getter that indicates if the application is loading.
   * @returns Observable<boolean> - Observable that emits loading state.
   * @example
   * this.stateService.isLoading$.subscribe(isLoading => console.log(isLoading));
   */
  get isLoading$(): Observable<boolean> {
    return this.stateSubject$.pipe(
      distinctUntilKeyChanged('isLoading'),
      map((state) => state.isLoading)
    );
  }

  /**
   * Observable getter that indicates if the application is loading.
   * @returns Observable<boolean> - Observable that emits loading state.
   * @example
   * this.stateService.userRole$.subscribe(userRole => console.log(userRole));
   */
  get userRole$(): Observable<string | null> {
    return this.stateSubject$.pipe(
      distinctUntilKeyChanged('userRole'),
      map((state) => state.userRole)
    );
  }

  /**
   * Observable getter for the current user state.
   * @returns Observable<CurrentUser | null> - Observable that emits the current user.
   * @example
   * this.stateService.currentUser$.subscribe(user => console.log(user));
   */
  get currentUser$(): Observable<CurrentUser | null> {
    return this.stateSubject$.pipe(
      distinctUntilKeyChanged('currentUser'),
      map((state) => state.currentUser)
    );
  }

  /**
   * Observable getter for the current stored math questions.
   * @returns Observable<StoredmathQuestions | null> - Observable that emits the current stored math questions.
   * @example
   * this.stateService.storedMathQuestions$.subscribe(storedMathQuestions => console.log(storedMathQuestions));
   */
  get storedMathQuestions$(): Observable<StoredMathQuestions | null> {
    return this.stateSubject$.pipe(
      distinctUntilKeyChanged('storedMathQuestions'),
      map((state) => state.storedMathQuestions)
    );
  }

  /**
   * Observable getter for the current counter values.
   * @returns Observable<CounterValues | null> - Observable that emits the current counter values.
   * @example
   * this.stateService.counterValues$.subscribe(counterValues => console.log(counterValues));
   */
  get counterData$(): Observable<CounterData | null> {
    return this.stateSubject$.pipe(
      distinctUntilKeyChanged('counterData'),
      map((state) => state.counterData)
    );
  }

  /**
   * Updates the loading state.
   * @param {boolean} isLoading - The new loading state.
   * @example
   * this.stateService.isLoading = true;
   */
  set isLoading(isLoading: boolean) {
    this.patchState({ isLoading });
  }

  /**
   * Updates the loading state.
   * @param {string} userRole - The new loading state.
   * @example
   * this.stateService.userRole = 'admin';
   */
  set userRole(userRole: string) {
    this.patchState({ userRole });
  }

  constructor() {
    this.partialStateUpdate$
      .pipe(
        // Use structuredClone for deep cloning the state.
        scan((acc, curr) => structuredClone({ ...acc, ...curr }), initialState)
      )
      .subscribe(this.stateSubject$);
  }

  /**
   * Partially updates the application state.
   * @param {Partial<State>} partialState - An object with the parts of the state to be updated.
   * @example
   * this.stateService.patchState({ isLoading: true });
   */
  patchState(partialState: Partial<State>): void {
    console.log('patchState', partialState);
    console.log('THIS WAS BEING CALLED SEVERAL TIMES');
    this.partialStateUpdate$.next(partialState);
  }

  /**
   * Selects and observes a single key from the application state.
   * @param {keyof State} keyString - The key of the state to select.
   * @returns Observable<State[keyof State]> - Observable that emits the selected state key.
   * @example
   * this.stateService.selectKey('isLoading').subscribe(isLoading => console.log(isLoading));
   */
  selectKey(keyString: keyof State): Observable<State[keyof State]> {
    return this.stateSubject$.pipe(
      distinctUntilKeyChanged(keyString),
      map((key) => key[keyString])
    );
  }

  /**
   * Selects and observes multiple keys from the application state.
   * @param {(keyof State)[]} keyArr - Array of keys to select.
   * @returns Observable<Partial<State>> - Observable that emits an object with the selected state keys.
   * @example
   * this.stateService.selectKeys(['isLoading', 'currentUser']).subscribe(state => console.log(state));
   */
  selectKeys(keyArr: (keyof State)[]): Observable<Partial<State>> {
    return this.stateSubject$.pipe(
      distinctUntilChanged((prev, curr) =>
        keyArr.some((key) => prev[key] !== curr[key])
      ),
      map((val) =>
        keyArr.reduce(
          (acc, key: keyof State) => ({ ...acc, [key]: val[key] }),
          {}
        )
      )
    );
  }

  /**
   * Resets the application state to its initial value.
   * @example
   * this.stateService.resetState();
   */
  resetState(): void {
    this.stateSubject$.next(initialState);
  }
}
