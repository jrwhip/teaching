import { Injectable } from '@angular/core';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../amplify/data/resource';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly client = generateClient<Schema>();

  get models() {
    return this.client.models;
  }

  get mutations() {
    return this.client.mutations;
  }
}
